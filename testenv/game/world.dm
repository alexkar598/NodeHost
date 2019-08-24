/*
	These are simple defaults for your project.
 */

/world
	fps = 25		// 25 frames per second
	icon_size = 32	// 32x32 icon size by default
	mob = /mob/player
	view = 6		// show up to 6 tiles outward from center (13x13 view)

/world/New()
	. = ..()
	startProcessing()

/area
	mouse_opacity = FALSE
	invisibility = 101

// Make objects move 32 pixels per tick when walking
/atom
	name = "No name set"
	desc = "No desc set"
	icon = 'icons/iconfile.dmi'
	
/atom/movable
	step_size = 32


/proc/MSGCRASH(msg)
	CRASH(msg)