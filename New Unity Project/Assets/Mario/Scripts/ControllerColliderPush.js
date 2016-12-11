/*
// Controller Collider Push 
// Walker Boys (www.walkerboystudio.com)
// November 28, 2011
// Description: Toggles pushing mode for player
// Instruction: Assign script to a gameObject where the player will 'push' an object
// Important: Currently layer 13 has the option for 'push', if you change it, just change this one
*/


static var push 	 : boolean 	= false;								// toggle for push mode
static var isPushing : boolean 	= false;								// toggle for pushing
var speedIdle 		 : float 	= 0.2;									// idle speed, could connect it directly to controller system - speedIdleMax

function OnTriggerStay ( other : Collider ) {							// trigger events for collider on push
	if ( other.tag == "push" || other.gameObject.layer == 13 && ControllerSystem.moveSpeed > speedIdle && !ControllerSystem.isCrouching )	// if collider equals pushing object tag name
	{
		push = true;													// enable push mode				
		isPushing = true;												// enable pushing
	}
}
function OnTriggerExit ( other : Collider ) {							// trigger events for collider on push
	if ( other.tag == "push" || other.gameObject.layer == 13 )			// if collider equals pushing object tag name
	{
		isPushing = false;												// disable pushing
	}
}
