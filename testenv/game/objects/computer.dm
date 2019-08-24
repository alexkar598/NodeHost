/obj/computer
    name = "computer"
    desc = "goes beep beep and boop boop"
    var/base_icon = "computer_blue"
    var/active = TRUE

/obj/computer/New(loc)
    . = ..()
    var/result = addProcess(src)
    if(!result)
        CRASH("Unable to add process for object [src.name] at location [loc] with error core")

/obj/computer/Del()
    . = ..()
    removeProcess(src)

/obj/computer/Process()
    . = ..()
    icon_state = base_icon + (active ? "_on" : "_off")
    return PROCESS_ALL_CLEAR    

/obj/computer/Click(location, control, params)
    . = ..()

    if(get_dist(usr,src) >= 2)
        return FALSE

    world << params
    world << params2list(params)

    var/list/paramslist = params2list(params)

    if(paramslist["ctrl"])
        active = !active
        return active

    //usr << browse('ReUI/webData/build/index.html',"window=reui_window_test;display=1;size=300x300;border=[paramslist["alt"]];can_close=1;can_resize=1;can_minimize=1;titlebar=1")

    
   