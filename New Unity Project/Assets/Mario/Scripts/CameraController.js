/*
// Camera Controller (Parts and pieces from everywhere)
// Walker Boys (www.walkerboystudio.com)
// November 28, 2011
// Description: Controls basic movement of camera
// Instruction: Assign script to any camera and complete inspector options 
*/

var target 						: Transform;							// target for camera to look at
var targetHeight 				: float 		= 1.0;					// height of target
var collisionLayers   			: LayerMask	 	= -1;					// collision layers for camera
var distance 					: float 		= 8.0;					// distance between target and camera
var xSpeed 						: float 		= 250.0;				// movement on horizontal
var ySpeed 						: float 		= 120.0;				// movement on vertical
var yMinLimit 					: float 		= -12;					// limit how low on vertical to rotate
var yMaxLimit 					: float 		= 80;					// limit how high on vertical to rotate
var rotationSpeed 				: float 		= 3.0;					// speed of rotation
var zoomMinLimit 				: float 		= 2;					// limit how close to zoom in (mouse wheel roll)
var zoomMaxLimit 				: float 		= 6;					// limit how far to zoom out (mouse wheel roll)
var zoomDampening 				: float 		= 5.0; 					// speed of zoom easing
var offsetFromWall 				: float 		= 0.1;					// distance away from walls

private var x 					: float 		= 0.0;					// store axis x from input
private var y 					: float 		= 0.0;					// store axix y from input
private var currentDistance   	: float; 								// current distance between target and camera
private var desiredDistance   	: float;								// wanted distance between target and camera
private var correctedDistance 	: float; 								// amount to correct for between target and camera


function Start 		() {																					// initialize 
    var angles : Vector2 = transform.eulerAngles;															// set vector 2 values from this transform (camera)
    x = angles.y;																							// set x to equal angle x
    y = angles.x;																							// set y to equal angle y
	
    currentDistance   = distance; 																			// set default distance
    desiredDistance   = distance; 																			// set default distance
    correctedDistance = distance; 																			// set default distance
}
function LateUpdate () {																					// after character moves and animations play
	var vTargetOffset : Vector3;																			// store vertical target offset amount (x,y,z)

	x += Input.GetAxis("CameraX") * xSpeed * 0.02;															// set x to axis movement horizontal
	y -= Input.GetAxis("CameraY") * ySpeed * 0.02;															// set y to axis movement vertical
	
	y = ClampAngle(y, yMinLimit, yMaxLimit);																// clamp the vertical movement between a min and max

	var rotation = Quaternion.Slerp(transform.rotation, Quaternion.Euler(y, x, 0), Time.deltaTime * 3);		// set rotation value to equal the rotation of the camera and time

	vTargetOffset = new Vector3 (0, -targetHeight, 0);														// calculate desired camera position
	position = target.position - (rotation * Vector3.forward * desiredDistance + vTargetOffset); 			// set camera position and angle based on rotation, wanted distance and target offset amount

	var collisionHit : RaycastHit; 																			// set a ray cast
	var trueTargetPosition :Vector3 = new Vector3 (target.position.x, target.position.y + targetHeight, target.position.z);		// check for collision using the true target's desired registration point as set by user using height  

	var isCorrected : boolean = false; 																		// check for movement of camera corrected because of collision
	if (Physics.Linecast (trueTargetPosition, position, collisionHit, collisionLayers.value)) 				// if there was a collision, correct the camera position and calculate the corrected distance  
	{ 
		correctedDistance = Vector3.Distance (trueTargetPosition, collisionHit.point) - offsetFromWall;		// corrected distance takes distances between target and hit point - an offset from wall to prevent clipping
		isCorrected = true;																					// if collided, set corrected to true
	}	

	if ( !isCorrected || correctedDistance > currentDistance )												// check if distance has not been corrected or greater than current distance
	{
		currentDistance = Mathf.Lerp (currentDistance, correctedDistance, Time.deltaTime * zoomDampening);	// for smoothing, lerp distance only if either distance wasn't corrected, or correctedDistance is more than currentDistance 
	}
	else 																									// else there was a collision (linecast) and we need to move the camera to the corrected amount
	{
		isCorrected = false;																				// set back to false so camera will lerp after corrected
		currentDistance = correctedDistance;																// else set current distance of camera to corrected amount
	}
	
	currentDistance = Mathf.Clamp (currentDistance, zoomMinLimit, zoomMaxLimit); 							// keep within legal limits
	position = target.position - (rotation * Vector3.forward * currentDistance + vTargetOffset); 			// recalculate position based on the new currentDistance 

	transform.rotation = rotation;																			// set camera rotation to current rotation amount
	transform.position = position;																			// set camera position to current position amount
}
static function ClampAngle (angle : float, min : float, max : float) {										// limit angle amount for vertical rotation
    if (angle < -360)																						// if angle is less than -360
    {
        angle += 360;																						// angle + 360
    }
    if (angle > 360)																						// if angle is greater than 360
    {
        angle -= 360;																						// angle - 360
    }
    return Mathf.Clamp (angle, min, max);																	// return the min max amount for angle
}














