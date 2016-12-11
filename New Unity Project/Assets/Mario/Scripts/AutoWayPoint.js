/* ---Unity Script---
// Auto Way Point 
// Walker Boys (www.walkerboystudio.com)
// November 28, 2011
// Description: Sets up and creates waypoint connections
// Instruction: Assign script to gameObjects being used as a waypoint or path position
*/

var connected 		 					: Array = Array ();							// array of connections
static var waypoints 					: Array = Array ();							// array of waypoints
static var kLineOfSightCapsuleRadius 	: float = 0.25;								// radius for line of sight

static function FindClosest ( pos : Vector3 ) : AutoWayPoint {
	var closest 		: AutoWayPoint;												// the closer two vectors, the larger the dot product will be
	var closestDistance : float = 100000.0;
	
	for ( var cur : AutoWayPoint in waypoints ) 
	{
		var distance = Vector3.Distance ( cur.transform.position, pos );
		if ( distance < closestDistance )
		{
			closestDistance = distance;
			closest = cur;
		}
	}
	return closest;
}

@ContextMenu ( "Update Waypoints" )
function UpdateWaypoints 				() {
	RebuildWaypointList ();
}
function Awake 							() {
	RebuildWaypointList();
}
function OnDrawGizmos 					() {										// draw the waypoint pickable gizmo
	Gizmos.DrawIcon ( transform.position, "Waypoint.tif" );		
}
function OnDrawGizmosSelected 			() {										// draw the waypoint lines only when you select one of the waypoints
	if ( waypoints.length == 0 )
		RebuildWaypointList ();

	for ( var p : AutoWayPoint in connected ) 
	{
		if ( Physics.Linecast ( transform.position, p.transform.position ) ) 
		{
			Gizmos.color = Color.red;
			Gizmos.DrawLine ( transform.position, p.transform.position );
		} 
		else 
		{
			Gizmos.color = Color.green;
			Gizmos.DrawLine ( transform.position, p.transform.position );
		}
	}
}
function RebuildWaypointList 			() {
	var objects : Object [] = FindObjectsOfType ( AutoWayPoint );
	waypoints = Array ( objects );
	
	for ( var point : AutoWayPoint in waypoints ) {
		point.RecalculateConnectedWaypoints ();
	}
}
function RecalculateConnectedWaypoints  () {
	connected = Array ();

	for ( var other : AutoWayPoint in waypoints ) 
	{		
		if ( other == this )														// don't connect to ourselves
			continue;	
			
		if ( !Physics.CheckCapsule ( transform.position, other.transform.position, kLineOfSightCapsuleRadius ) )	// do we have a clear line of sight?
		{
			connected.Add( other );
		}
	}	
}
