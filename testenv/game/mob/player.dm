/mob
	density = TRUE

/mob/player
	name = "Player"
	desc = "This is you, a player. You are dumb. "
	icon_state = "player"

/mob/player/Login()
	. = ..()
	src << "<h1>Login succesful as [src.ckey]</h1>"
	name = initial(name)

/mob/npc
	name = "Non Playable Character"
	desc = "You can't play with or as me. "
	icon_state = "npc"






//separation from the testenv and the code for nodehost







/client/verb/cnt()
	set name = "testing"
	world << "first one"
	world.Export("http://localhost:18595/?AAAA")
	sleep(50)
	world << "second one"
	world.Export("http://localhost:18595/cat?BBBB")

//actual nodehost

//config
#define NH_AUTHKEY "yeet"
#define NH_PROVIDER "nodehost"
//#define NH_SINGLE_TOPIC

var/datum/nodehost/nh = new /datum/nodehost

/datum/nodehost
	var/list/topiccache = new()

/datum/nodehost/New()
	for (var/type in (typesof(/datum/topicdatum) - /datum/topicdatum))
		topiccache += new type()

/datum/topicdatum
	var/id //unique id
	var/topickey //override if you want this topic to require an additional key(eg: allowing 2 groups of topics,admin and host)

/datum/topicdatum/proc/Run()


/datum/topicdatum/shutdown
	id = "shutdown"

/datum/topicdatum/shutdown/Run()
	. = TRUE //return true if shutdown happened,false if ignored
	shutdown()

/datum/topicdatum/restart
	id = "restart"

/datum/topicdatum/restart/Run()
	. = TRUE //return true if reboot happened,false if ignored
	world.Reboot()

/world/Topic(T)
	var/params = params2list(T)
	if((params["provider"] == NH_PROVIDER) && (params["key"] == NH_AUTHKEY))
		for(var/V in nh.topiccache)
			var/datum/topicdatum/D = V
			if(D.id == params["action"])
				if(D.topickey == null || D.topickey == params["extrakey"])
					return D.Run(params["extraparam"])
	

	

	