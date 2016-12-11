/*
// Controller Collider Grab 
// Walker Boys (www.walkerboystudio.com)
// November 28, 2011
// Description: Allows player to grab/pickup objects and throw them
// Instruction: Assign script to a gameObject called colliderGrab (include collider, isTrigger and animations to use for pickup and throw)
*/

private var otherObject 	: Transform;										// object we grab transform
private var isPickingUp 	: boolean = false;									// toggle for picking object up
static var grabs 			: boolean = false;									// toggle for grab mode
static var pickedUp 		: boolean = false;									// toggle for object picked up
static var isGrabbing 		: boolean = false;									// toggle for grabbing

function Update 		() {													// loop through events
	Grab ();
}
function Grab 			() {													// grab system
	if ( isPickingUp && Input.GetButtonDown ( "Fire1" )  )						// grab object
	{	
		isPickingUp = false;													// disable picking up
		Destroy ( otherObject.gameObject.GetComponent( "Rigidbody" ) );			// get rid of the rigidbody to player can pickup object with no issues
		otherObject.transform.parent = transform;								// set other objects parent to players object (colliderGrab)
		GetComponent.<Animation>().Play ( "grab_pickup" );										// play the pickup animation
		otherObject.position = transform.position;								// align other object with player center position (based on the colliderGrab ga)
		isGrabbing = true;														// if all worked out, enable grabbing
		yield;																	// break out for one frame so that the next if check doesn't happen till then
	}
	if ( isGrabbing && Input.GetButtonDown ( "Fire1" ) )						// throw object
	{	
		var forward : Vector3 = this.transform.forward * ( ControllerSystem.moveSpeed + .5 );	 // forward stores player forward direction with speed
		var up : Vector3 = Vector3 ( 0, 2, 0 );									// up holds vec3 up direction 
		var direction : Vector3 = forward + up;									// direction stores value for throwing object
		otherObject.parent = null;												// break parent connection
		otherObject.gameObject.AddComponent ( Rigidbody );						// add the rigidbody back to the object
		Destroy(otherObject.gameObject.GetComponent ( "BoxCollider" ) );		// get rid of the boxcollider - it hits him while throwing so if we destroy it, there's no issue
		otherObject.gameObject.GetComponent.<Rigidbody>().AddForce ( ( direction ) * 150 );		// add force to throw object from player
		GetComponent.<Animation>().Play ( "grab_putdown" );										// play the grab put down animation
		isGrabbing = false;														// disable grabbing 
		yield WaitForSeconds ( .1 );											// wait a second before adding box collider back in so that it doesn't hit the player
		otherObject.gameObject.AddComponent ( BoxCollider );					// add the box collider back
	}
}
function OnTriggerEnter ( other : Collider ) {									// trigger events for collider on grab
	if ( other.tag == "grab" ) 													// if collider equals grabbing object
	{																			// enable grabbing and pushing mode 		
		otherObject = other.transform;											// set other object to collided object
		isPickingUp = true;														// enable picking up 
		grabs = true;															// enable grabs
	}
}
function OnTriggerExit 	( other : Collider ) {									// trigger event for exiting collider
	if ( other.tag == "grab" )													// if collider equals grabbing object
	{
		isPickingUp = false;													// turn off picking up
	}
}
