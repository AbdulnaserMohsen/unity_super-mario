/* ---Unity Script---
// Ai Patrol 
// Walker Boys (www.walkerboystudio.com)
// November 28, 2011
// Description: Follow (patrol) from/to each waypoint in calculated group (based on autowaypoint.js)
// Instruction: Assign script to a character (npc) that will walk around
*/

var speed 					 		: float 		= 3.0;															// movement speed for player
var rotationSpeed 			 		: float 		= 5.0;															// rotation speed for player
var pickNextWaypointDistance 		: float 		= 2.0;															// distance of next waypoint

@script RequireComponent ( CharacterController )																	// make sure there is always a character controller

function Start  			() 					 	{																// initialize
	Patrol ();																										// start patroling
}
function Patrol 			() 					 	{																// pick waypoints and move 
	var curWayPoint = AutoWayPoint.FindClosest ( transform.position );												// use autoWayPoint script to find waypoint position
	while ( true ) 																									// constantly patrol
	{
		var waypointPosition : Vector3 = curWayPoint.transform.position;											// set way point position to current way point position

		if ( Vector3.Distance ( waypointPosition, transform.position ) < pickNextWaypointDistance )					// if current distance is < next distance then 
			curWayPoint = PickNextWaypoint ( curWayPoint );															// keep moving player toward waypoint position
	
		MoveTowards ( waypointPosition );																			// move towards our target
		
		yield;																										// yield one frame
	}
}
function MoveTowards 		( position : Vector3 ) 	{																// move player towards position (waypoint)
	var direction = position - transform.position;																	// set position based on current waypoint - current position 
	direction.y = 0;																								// y movement set to 0

	transform.rotation = Quaternion.Slerp ( transform.rotation, Quaternion.LookRotation ( direction ), rotationSpeed * Time.deltaTime );// rotate towards the target
	transform.eulerAngles = Vector3 ( 0, transform.eulerAngles.y, 0 );

	var forward 		: Vector3 = transform.TransformDirection ( Vector3.forward );								// modify speed so we slow down when we are not facing the target
	var speedModifier 	: float   = Vector3.Dot ( forward, direction.normalized );									// stores angle between vectors
	speedModifier 				  = Mathf.Clamp01 ( speedModifier );												// clamp between 0 and 1
	direction 					  = forward * speed * speedModifier;												// move the character based on direction, speed and angle between

	GetComponent ( CharacterController ).SimpleMove ( direction );													// use simplemove function for character controller - basic moving system
	
	GetComponent.<Animation>().Play ( "walk" );																		// play animation - direct call to walk from animation component
}
function PickNextWaypoint 	( currentWaypoint : AutoWayPoint ) {													// get next way point from auto way point script
	
	var forward : Vector3 = transform.TransformDirection ( Vector3.forward );										// the forward direction in which we are walking
	var best : AutoWayPoint = currentWaypoint;																		// the closer two vectors, the larger the dot product will be.
	var bestDot : float = -10.0;																					// value for best waypoint
	
	for ( var cur : AutoWayPoint in currentWaypoint.connected ) 													// loop through all way points in group
	{
		var direction : Vector3 = Vector3.Normalize ( cur.transform.position - transform.position );				// find direction normalized between cur waypoint and current position
		var dot : float = Vector3.Dot ( direction, forward );														// set which direction it faces (1 is same direction, -1 opposite, 0 perpendicular)
		if ( dot > bestDot && cur != currentWaypoint ) 															 	// if player is not to the waypoint yet
		{
			bestDot = dot;																							// set bestDot to dot value
			best = cur;																								// set waypoint to current waypoint
		}
	}
	
	return best;																									// return best (current waypoint)
}
