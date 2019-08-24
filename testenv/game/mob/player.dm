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

/client/verb/cnt()
	set name = "testing"
	world << "first one"
	world.Export("http://localhost:18595/?AAAA")
	sleep(50)
	world << "second one"
	world.Export("http://localhost:18595/cat?BBBB")

/world/Topic(T)
	world.log << T
	if(findtext(T,"AAAAAAAA") == 1)
		world.log << "received topic,returning stuff"
		return "whatever"
	world.log << "wrong thing mate"
	return "not stuff"
