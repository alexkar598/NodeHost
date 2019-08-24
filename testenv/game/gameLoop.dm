#define PROCESS_ALREADY_ACTIVE -1
#define PROCESS_OBJECT_DOES_NOT_EXIST -2
#define PROCESS_ALREADY_INACTIVE -3
#define PROCESS_OBJECT_ADDED 1
#define PROCESS_OBJECT_REMOVED 

#define GAMELOOP_ALREADY_PROCESSING -1
#define GAMELOOP_ALREADY_OFFLINE -1

#define PROCESS_ALL_CLEAR 1
#define PROCESS_KILL_ME 2
#define PROCESS_ERROR 3

var/datum/list/processes = list()
var/processing = FALSE
var/tick_time = 0.5

proc/startProcessing()
	if(processing)
		return GAMELOOP_ALREADY_PROCESSING

	processing = TRUE

	//var/i = 0
	while(processing)
		for(var/datum/A in processes)
			var/result = A.Process()
			if(result == PROCESS_KILL_ME)
				removeProcess(A)
			
			if(result == PROCESS_ERROR)
				MSGCRASH("Process reported issue")

		//world.log << "Running loop at iteration [i]"
		//i++
		sleep(tick_time)

proc/stopProcessing()
	if(!processing)
		return GAMELOOP_ALREADY_OFFLINE

	processing = FALSE

proc/addProcess(var/datum/object)
	if(!object)
		return PROCESS_OBJECT_DOES_NOT_EXIST
	if(object in processes)
		return PROCESS_ALREADY_ACTIVE

	processes += object

	return PROCESS_OBJECT_ADDED

proc/removeProcess(var/datum/object)
	if(!object)
		return PROCESS_OBJECT_DOES_NOT_EXIST
	
	if(!(object in processes))
		return PROCESS_ALREADY_INACTIVE

	processes -= object

	return PROCESS_OBJECT_REMOVED



/datum/proc/Process()
	return PROCESS_KILL_ME