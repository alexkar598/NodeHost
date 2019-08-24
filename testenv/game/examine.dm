/atom/verb/examine(var/atom/O in view())
	usr << "You examine \the [O.name]."
	usr << "[O.desc]"
	..()