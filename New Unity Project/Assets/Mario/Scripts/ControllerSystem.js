/*
// Controller System for Player 
// Walker Boys (www.walkerboystudio.com)
// November 28, 2011
// Description: Controls all character (player) actions for movement / interactions
// Instruction: Assign script to main character (gameObject). Also, assign a characterController to the component
// Function arguments: Lots. :) Be sure to go through them. 
// Main variables to use are below:
// moveDirection   = player forward direction
// targetDirection = camera forward direction
// inAirVelocity   = speed of player (mainly for jumps)
*/

var skinMeshRenderer				: SkinnedMeshRenderer;							// need skinned mesh renderer to toggle hide/unhide option for player
var cameraObject					: Camera;										// player camera  (usually main camera)
var colliderAttack					: GameObject;									// collider for player to attack with
var colliderHurt					: GameObject;									// collider for player to get hurt
var canWalk							: boolean 			= true;						// enabled walking
var canJog							: boolean 			= true;						// enabled jogging
var canRun							: boolean 			= true;						// enabled running
var canSprint						: boolean 			= true;						// enabled sprint
var canJumpAll						: boolean			= true;						// enabled any jump
var canJump_1						: boolean			= true;						// enabled jump 1
var canJump_2						: boolean			= true;						// enabled jump 2
var canJump_3						: boolean			= true;						// enabled jump 3
var canJumpFromCrouch				: boolean			= true;						// enabled jumping from crouch
var canJumpFromObject 				: boolean			= true;						// enabled jumping off object
var canControlDecent				: boolean			= true;						// enabled controlling decent
var canCrouch						: boolean			= true;						// enabled crouching
var canCrouchHoldKeyDown			: boolean 			= true;						// enabled crouching while holding key down
var canAngleSlide					: boolean 			= true;						// enabled crouching while holding key down
var canIdleRotate					: boolean			= true;						// enabled idle turning 
var canJumpFromPad					: boolean			= true;						// enable jumping from pads
var canFall							: boolean			= true;						// enable falling from jumps
var canLand							: boolean			= true;						// enable landing from jumps
var canHurt							: boolean			= true;						// enable hurting from enemies
var canAttack						: boolean			= true;						// enable attack ability
var canKillzone						: boolean			= true;						// enable killzones for player
var canGrab							: boolean			= true;						// enable pushable objects for player
var canPush							: boolean			= true;						// enable pushable objects for player
var autoPush						: boolean			= true;						// enable automatic pushing of objects
var keyboardControls 				: boolean 			= false;					// enable keyboard overide for speed control

var speedIdleMax					: float 			= 0.2;						// maxium idle speed before moving 
var speedIdleRotate					: float 			= 1.2;						// rotate speed on idle turn
var speedWalk						: float				= 3.0;						// maximum walking speed
var speedJog						: float				= 5.0;						// maximum jogging speed
var speedRun						: float				= 8.0;						// maximum running speed
var speedSprint						: float				= 12.0;						// maximum sprint speed
var speedSlide						: float 			= 3.0;						// maximum sliding speed
var speedPush						: float				= 1.5;						// maximum push speed
var speedGrab						: float				= 2.0;						// maximum push speed
var speedJumpFromCrouch 			: float				= 3.0;						// maximum jump from crouch height
var speedJumpFromObject 			: float				= 10.0;						// maximum jump from object height 
var speedCrouch						: float 			= 0.0;						// maximum crouching speed
var speedInAir						: float				= 1.0;						// var inAirControlAcceleration
var speedSmoothing					: float				= 10.0;						// amount to smooth by
var speedRotation					: float				= 50.0;						// amount to rotate by

var currentSpeed					: float 			= 10.0;						// store speed of character (walk, jog, run, sprint)
var currentJumpHeight				: float 			= 0.0;						// current height of character

var jump_1							: float				= 8.0;						// height for first jump
var jump_2							: float				= 10.0;						// height for second jump
var jump_3							: float				= 15.0;						// height for third jump

var jumpFromCrouch					: float 			= 14.0;						// height for jump from crouch
var jumpFromObject					: float 			= 8.0;						// height for jump from object
var jumpFromObjectTag 				: String 			= "wall";					// tag name of object player can jump from

var jumpComboTime					: float 			= 1.5;						// combo time between jumps to go to next jump mode (jump 1,2,3)
var jumpDelayTime 					: float 			= 0.5;						// time delay amount (currently used in jump 1 to keep animation from skipping to default stance)

var crouchControllerHeight  		: float 			= 1.0;						// value for height of controller box
var crouchControllerCenterY 		: float 			= 0.5;						// amount to move controller down 

var slideTag 						: String			= "slide";					// tag name for any object that player can slide on (you can just set it to slide based on value only
var slideThreshold 					: float 			= 0.88;						// amount of angle when slide-able
var slideControllableSpeed 			: float 			= 5.0;						// speed where player still has control sliding down

var pushPower 						: float 			= 0.5;						// how hard the player can push
var pushLayers  					: LayerMask 		= -1;						// layers for pushing objects

var gravity							: float				= 20.0;						// gravity (downward pull only, added to vector.y) 
var health 							: int				= 100;						// hold health count

var aniIdle_1 						: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniIdle_2						: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniWalk 						: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniJog 							: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniRun 							: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniSprint 						: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniCrouchIdle					: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniLeanLeft						: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniLeanRight					: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniJumpFromCrouch				: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniJumpFromObject				: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniJump_1 						: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniJump_2 						: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniJump_3 						: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniJumpFall						: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniJumpLand						: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniSlide 						: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniGrab		 					: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniGrabIdle	 					: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniPush		 					: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)
var aniLand		 					: AnimationClip;								// animation clip for calling up animations (use this rather than direct call)

var DebugMode						: boolean			= true;						// sets mode to debug and prints messages to console

@HideInInspector																	// hide characterController in the inspector but keep public - for now
var characterController 			: CharacterController;							// instance of character controller
@HideInInspector 
static var moveSpeed				: float 			= 0.0;						// current player moving speed

private var moveDirection			: Vector3			= Vector3.zero;				// store initial forward direction of player
private var inAirVelocity			: Vector3			= Vector3.zero;				// current currentSpeed while in air 

private var smoothDirection			: float 			= 10.0;						// amount to smooth camera catching up to player
private var jumpRepeatTime			: float				= 0.15;						// amount of time between jumps to make combo happen
private var jumpFromObjectDelay 	: float				= 0.15;						// delay time so player can't just jump constantly from objects
private var jumpDelay				: float				= 0.15;						// standard jump delay time
private var groundedDelay			: float				= 0.15;						// 
private var cameraTimeDelay			: float				= 0.0;						// delay on camera time (to allow smoother follow after player movement)
private var sprintLastTime			: float				= 0.0;						// time last sprint happened
private var speedReset				: float				= 0.0;						// reset speed 
private var verticalSpeed			: float				= 0.0;						// speed for vertical use
private var walkTimeStart			: float 			= 0.0;						// store when user started walking to transition to jog

private var isControllable			: boolean			= true;						// control for all movement (could be public)
private var isMoving				: boolean			= false; 					// is player pressing any keys
static  var isCrouching				: boolean 			= false;					// crouching enabled
private var isJumping_1				: boolean 			= true;						// jumping 1 enabled
private var isJumping_2 			: boolean 			= false;					// jumping 2 enabled
private var isJumping_3 			: boolean			= false;					// jumping 3 enabled
private var isLanding 				: boolean			= false;					// is player landing
private var isKilled				: boolean			= false;					// killzone for player
private var curTime					: float 			= 0.0;						// current time 
private var showPlayer				: boolean   		= true;						// hide / show player toggle
private var resetCharController		: boolean			= false;					// resets controller for character toggle
private var objectJumpContactNormal : Vector3;										// average normal of the last touched geometry
private var touchObjectJumpTime 	: float 			= -1.0;						// when did we touch the wall the first time during this jump (Used for wall jumping)
private var wallJumpTimeout 		: float 			= 0.5;						// delay time from jumping off walls again
private var jumpableObject			: boolean			= false;					// toggle for jumping off walls
private var controllerHeightDefault : float;										// value of controller original height
private var controllerCenterYDefault: float;										// value of controller original center Y
private var slideDirection 			: Vector3;										// direction player is sliding
private var collisionFlags			: CollisionFlags;								// last collision flag returned from control move
private var coin 					: int 				= 0;						// hold coin count	
private var key  					: int 				= 0;						// hold key count
private var jumpingFromPad 			: boolean 			= false;					// disable jumpPad till ready
private var playerStartPosition		: Vector3;										// value to hold player position at start
private var playerStartRotation		: Quaternion;									// value to hold player position at start
private var enemyHit 				: boolean;										// enable enemy hitting player 
private var enemyHurt				: GameObject;									// health reset to store original health value
private var resetHealth				: int;											// health reset to store original health value
private var hitDirection 			: Vector3 			= Vector3(0,10,-2.5);		// hit direction to send player (could make it complicated, but lets not)
private var pushObject				: Transform 		= null;						// store push game object																
private var grabObject				: Transform 		= null;						// store grab / pickup / putdown game object																
private var tempSpeed 				: float 			= 0.0;						// hold current speed

@script RequireComponent ( CharacterController )									// if no characterController assigned, apply one -later

function Reset					() {												// reset all variables and options to null (0) (add to list as it builds)
	if (!isControllable)
	{
		Input.ResetInputAxes();														// stop all inputs if not controllable
	}
}
function Awake 					() {												// before starting, get moveDirection forward from this.gameObject
	moveDirection = transform.TransformDirection ( Vector3.forward ); 				// assign moveDirection local to world forward
}
function Start 					() {												// initialize variables
	characterController = GetComponent ( CharacterController );						// initialize characterController
	characterController.tag = "Player";												// set tag name to 'Player'
	controllerHeightDefault = characterController.height;							// set controllerHeightDefault to controllers starting height
	controllerCenterYDefault = characterController.center.y;						// set controllerCenterYDefault to controllers starting center Y
	GetComponent.<Animation>().Stop ();																// set animation to stop
	AnimationClipCheck ();															// check animation clips loaded, print missing ones to console	
	playerStartPosition = transform.position;										// store player initial position, move player back to this if he dies
	playerStartRotation = Quaternion.LookRotation (transform.position);				// store player initial rotation 
	resetHealth = health;															// store health value in resetHealth 
	tempSpeed = currentSpeed;														// store tempSpeed of player (used when player pushes)
}
function UpdateMoveDirection 	() {												// motor, ani, and direction of player			
	var forward : Vector3 = cameraObject.transform.TransformDirection ( Vector3.forward );	// forward vector relative to the camera along the x-z plane
	forward.y = 0;																	// up/down is set to 0
	forward = forward.normalized;													// set forward between 0-1	
	var right : Vector3 = Vector3( forward.z, 0, -forward.x );						// right vector relative to the camera, always orthogonal to the forward vector

	var vertical : float   = Input.GetAxisRaw ( "Vertical"   );						// get input vertical
	var horizontal : float = Input.GetAxisRaw ( "Horizontal" );						// get input horizontal

	var targetDirection : Vector3 = horizontal * right + vertical * forward;		// target direction relative to the camera

	if ( IsGrounded () )															// if player on ground
	{
		if ( targetDirection != Vector3.zero )										// store currentSpeed and direction separately
		{
			moveDirection = Vector3.Lerp ( moveDirection, targetDirection, smoothDirection * Time.deltaTime );	// smooth camera follow player direction
			moveDirection = moveDirection.normalized;								// normalize (set to 0-1 value)
		}	
		var currentSmooth : float = speedSmoothing * Time.deltaTime;				// smooth currentSpeed based on current target direction
		
		targetSpeed = Mathf.Min ( targetDirection.magnitude, 1.0 ); 				// set targetSpeed limit for diagonal movement
		moveSpeed  = Mathf.Lerp ( moveSpeed, targetSpeed * targetDirection.magnitude * currentSpeed, currentSmooth );	// set moveSpeed to smooth to currentSpeed set

		jumpableObject = false;														// keep false while on ground
		
		Idle   			();															// check for player idle 
		Crouch 			();															// check for player crouching
		Walk   			();															// check for player walking
		Jog    			();															// check for player jogging
		Run    			();															// check for player running
		Sprint 			();															// check for player sprinting
		Jump_1   		();															// check for player jumping 1
		Jump_2   		();															// check for player jumping 2
		Jump_3		   	();															// check for player jumping 3
		JumpFromCrouch 	();															// check for player jumping from crouch
		AngleSlide		();															// check for player sliding on slope
		IdleRotate		();															// check for player idle turning
		JumpPad			();															// check for player moving onto jump pad
		Hurt			();															// check for player getting hit by enemy
		Attack			();															// check for player attacking with feet collider
		Grab 			();															// check for player grabbing gameObject tagged grab
		Push 			();															// check for player pushing gameObject tagged push
		KeyboardMovementSpeed ();
	}
	else																			// if player is in air 
	{										
		inAirVelocity += targetDirection.normalized * Time.deltaTime * speedInAir;	// if in air, move player down based on velocity, direction, time and speed
		JumpFromObject ();															// check for player jumping from objects tagged 'wall'
		Fall ();																	// check if player is falling from jump		
	}
	Killzone ();																	// check for player triggering killzone box
}
function Update 				() {												// loop for controller
	if ( isControllable )															// if player controllable, then move character
	{
		SetGravity ();																// pulls character to the ground 'if' in air
		UpdateMoveDirection ();														// motor, direction and ani for player movement

		var movement : Vector3 = moveDirection * moveSpeed + Vector3 ( 0, verticalSpeed, 0 ) + inAirVelocity; // stores direction with speed (h,v)
		movement *= Time.deltaTime;													// set movement to delta time for consistent speed
		
		objectJumpContactNormal = Vector3.zero;										// reset vectors back to zero
		
		collisionFlags = characterController.Move ( movement );						// move the character controller	
		
		if ( IsGrounded () ) 														// character is on the ground (set rotation, translation, direction, speed)
		{
			transform.rotation = Quaternion.LookRotation ( moveDirection );			// set rotation to the moveDirection
			inAirVelocity = Vector3(0,-0.1,0);										// turn off check on velocity, set to zero/// current set to -.1 because zero won't keep him on isGrounded true. goes back and forth			
			if ( moveSpeed < 0.15 ) 												// quick check on movespeed and turn it off (0), if it's
				moveSpeed = 0;														// less than .15
		}
		else 																		// player is in the air
		{
			transform.rotation = Quaternion.LookRotation ( moveDirection );			// quick adjustment for jumping off wall, turn player around in air
		}
	}
	ExampleShowHidePlayer ();														// example usage of show/hide functions	
}

function Idle 					() {												// idles player
	if ( moveSpeed <= speedIdleMax && !isCrouching )								// check that speed is 0 for idle range
	{
		GetComponent.<Animation>().CrossFade ( aniIdle_1.name );										// play animation
		Message ( "Ani State: Idle" );												// print current animation state
	}	
}
function Walk 					() {												// walks player
	if ( canWalk )
	{
		if ( moveSpeed > speedIdleMax && moveSpeed < speedJog )						// check that speed is within walk range
		{
			GetComponent.<Animation>().CrossFade ( aniWalk.name );									// play animation
			Message ( "Ani State: Walk" );											// print current animation state
		}
	}
}
function Jog	 				() {												// jogs player
	if ( canJog )
	{
		if ( moveSpeed > speedWalk && moveSpeed < speedRun ) 					 	// check that speed is within jog range
		{
			GetComponent.<Animation>().CrossFade ( aniJog.name );									// play animation
			Message ( "Ani State: Jog" );											// print current animation state
		}
	}
}
function Run 					() {												// runs player
	if ( canRun )
	{
		if ( moveSpeed > speedJog && moveSpeed < speedSprint )						// check that speed is within run range 
		{
			GetComponent.<Animation>().CrossFade ( aniRun.name );									// play animation
			Message ( "Ani State: Run" );											// print current animation state
		}
	}
}
function Sprint 				() {												// sprints player

} 
function Jump_1 				() {												// default jump (if no combo, then defaults to this jump each time)
	if ( canJumpAll )
	{
		if ( !canJump_2 )															// if jump_2 turned off, then just repeat jump_1 only
		{
			isJumping_1 = true;														// reset isJumping_1 to true so that it goes back to it
			isJumping_2 = false;													// turn off isJumping_2 to go to jump 1
		}
		if ( canJump_1 && !isCrouching && !ControllerColliderGrab.isGrabbing )		// check that player has not picked up an object and if jump 1 enabled and player not crouching (incase toggle is off)
		{
			if ( Input.GetButtonDown ( "Jump" ) && isJumping_1 && !isJumping_2 && !isJumping_3 && curTime + jumpDelayTime < Time.time ) // check for button pressed down "Jump" and isjumping 1 enabled and delay to prevent to fast of jumping
			{
				isJumping_1 = false;												// set jump 1 to false so it just does it once
				curTime = Time.time;												// grab the current actual time to use for testing against next button press
				GetComponent.<Animation>().CrossFade ( aniJump_1.name );								// play jump 1 animation
				currentJumpHeight = jump_1;											// set jump 1 height to current jump height
				inAirVelocity.y = currentJumpHeight;								// set current jump to in Air Y (don't have to by-pass twice, just doing it)
				Message ( "Ani State: Jump 1" );									// print on debug that we jumped
			}	
			else if ( IsGrounded () && !isJumping_1 && !isJumping_2 && !isJumping_3 )	// if the player jumped and on the ground, then setup for combo
			{
				Message ( "Combo 2 ready to go!");									// print that you can go to combo jump 2 
				yield;
				isJumping_1 = false;												// keep jump 1 set to false
				isJumping_2 = true;													// set jump 2 to true 
			}
			else if ( ControllerColliderHurt.enemyHit || ControllerColliderAttack.isAttacking )
			{
				inAirVelocity.y = 0;
				isJumping_1 = false;
			}
		}
	}
}
function Jump_2					() {												// jump 2 in combo

}
function Jump_3					() {												// jump 3 in combo (final jump)

}
function JumpFromCrouch			() {												// jump from crouch position

}
function JumpFromObject			() {												// jumping from an object

}
function JumpPad				() {												// jump from crouch position

}
function AngleSlide				() {												// sliding if slope (angle) too much

}
function IdleRotate				() {												// turn left/right while in idle 
	if ( canIdleRotate )															// toggle idle rotate (turn left / right)
	{
		if ( Input.GetAxis ( "Horizontal" ) > 0 && Input.GetAxis ( "Horizontal" ) < speedIdleMax || Input.GetAxis( "Vertical" ) > 0 && Input.GetAxis ( "Vertical" ) < speedIdleMax ) 		// check for horizontal movement only at idle value
		{
			GetComponent.<Animation>().CrossFade( aniWalk.name );									// play animation
			transform.eulerAngles.y += Input.GetAxis ("Horizontal") * speedIdleRotate;	// rotate based on horizontal movement / add deltaTime
			Message ( "Ani State: Idle Turn Right" );								// print animation state 
		}
		else if ( Input.GetAxis ( "Horizontal" ) < 0 && Input.GetAxis ( "Horizontal" ) > -speedIdleMax  || Input.GetAxis( "Vertical" ) < 0 && Input.GetAxis ( "Vertical" ) > -speedIdleMax  ) // check for horizontal movement only at idle value
		{
			GetComponent.<Animation>().CrossFade ( aniWalk.name );									// play animation
			transform.eulerAngles.y -= Input.GetAxis ( "Horizontal" ) * -speedIdleRotate;	// rotate based on horizontal movement / add deltaTime
			Message ( "Ani State: Idle Turn Left" );								// print animation state
		}
	}
}
function Crouch					() {												// crouch player

}
function Fall					() {												// player is in the air
	if ( canFall )
	{
		if ( slideDirection.magnitude <= 0 )										// if player not on ground and not sliding
		{	 
			GetComponent.<Animation>().CrossFadeQueued ( aniJumpFall.name, 0.3, QueueMode.CompleteOthers );	// animation for falling
			Message ( "Ani State: Fall" );											// print animation state
		}
	}
}
function Attack					() {												// player jumps on enemy head - with feet

}
function Hurt					() {												// player hurt by enemy objects

}
function Killzone				() {												// player killed if in this area, respawn at start
	if ( canKillzone )																// toggle killzone areas
	{
		if ( isKilled ) 															// player killed enabled
		{
			isKilled = false;														// turn off isKilled
			HidePlayer ();															// hide player
			yield WaitForSeconds (1);												// wait one second before moving player - keeps camera in that spot
			GetComponent.<Animation>().Stop();														// stop current animation
			transform.rotation = playerStartRotation;								// set rotation just in case
			transform.position = playerStartPosition;								// move player to original starting point (stored in Start())
			moveDirection = Vector3(0,0,.1);										// set player move speed to almost zero (when he comes back in we want him stopped)- almost zero throws error in update
			yield WaitForSeconds (1);												// wait one second before showing player
			GetComponent.<Animation>().Play ( aniIdle_1.name );										// play animation
			Message ( "Ani State: Idle" );											// print current 
			isJumping_1 = true;														// reset jumping to true
			isJumping_2 = false;													// reset jumping to false
			isJumping_3 = false;													// reset jumping to false
			health = resetHealth;													// reset health to default
			ShowPlayer ();															// show player			
		}
	}
}
function Push 					() {												// player can push objects by moving in to them
	if ( canPush )																	// toggle push
	{
		if ( ControllerColliderPush.push && autoPush )								// check push collider and auto pushing on
		{	
			if ( moveSpeed < speedIdleMax ) 										// check for move speed < idle maximum
			{
				ControllerColliderPush.push = false;								// set push to false
				ControllerColliderPush.isPushing = false;							// set is pushing to false
			}
			if ( ControllerColliderPush.isPushing && !isCrouching && !ControllerColliderGrab.isGrabbing && moveSpeed >= speedIdleMax )	// is pushing and not crouching
			{
				currentSpeed = speedPush;											// when push player slows to half speed				
				GetComponent.<Animation>().CrossFade ( aniPush.name );								// play push animation if button pressed																			// print pushing it							
			}		
			if (  !ControllerColliderPush.isPushing && moveSpeed < speedIdleMax )	// when button up, detach object from player
			{	
				currentSpeed = tempSpeed;											// reset currentSpeed to default
				Message ("Dropping it");											// print dropping it
			}
		}
		else if ( ControllerColliderPush.push && !autoPush )						// if autopush off, then require button press to push objects
		{
			if ( Input.GetButton ( "RightBumper" ) && ControllerColliderPush.isPushing && !isCrouching && !ControllerColliderGrab.isGrabbing && moveSpeed >= speedIdleMax )
			{
				currentSpeed = speedPush;											// when push player slows to half speed				
				GetComponent.<Animation>().CrossFade ( aniPush.name );								// play push animation if button pressed		
			}
			if ( Input.GetButtonUp ( "RightBumper" ) && ControllerColliderPush.isPushing )	// when button up turn off pushing
			{
				currentSpeed = tempSpeed;											// reset currentSpeed to default
				Message ("Dropping it");											// print dropping it				
			}
		}
	}
}
function Grab					() {												// player can grab objects

}
function ShowPlayer				() {												// turn player rendering mesh 'on'
	skinMeshRenderer.enabled 	= true;
	isControllable				= true;
}
function HidePlayer				() {												// turn player rendering mesh 'off'
	skinMeshRenderer.enabled 	= false;
	isControllable 				= false;
}
function KeyboardMovementSpeed 	() {												// controls for keyboard movement/speed
	if ( keyboardControls )															// enable keyboard controls if no joystick
	{
		currentSpeed = 3;															// hardcode cur speed to 3
		var curTimer 	: float = 0.0;												// store current time of game
		var curSmooth 	: float = speedSmoothing * Time.deltaTime;					// smooth out with speed value and delta
		var timeStopped : boolean = false;											// toggle for stopping time

		if ( !Input.anyKey )														// if no key is pressed
		{
			moveSpeed = 0;															// set moving to zero
		}
		
		if ( moveSpeed < speedIdleMax )												// if still within idle range
		{
			curTimer = Time.time;													// grab current time
		}
		
		if ( Input.GetButton ("Fire3") && !ControllerColliderGrab.isGrabbing )		// pushing 'control' while moving makes player sprint
		{
			targetSpeed = speedSprint;
		}
		else if ( moveSpeed > speedIdleMax )
		{
			if ( Time.time - 1 >= curTimer )
			{ 
				targetSpeed = speedWalk;
			}
			if ( Time.time - 2 > curTimer )
			{
				targetSpeed = speedJog;
			}
			if ( Time.time - 3 > curTimer )
			{
				targetSpeed = speedRun;
			}
			if ( Time.time - 6 > curTimer )
			{
				targetSpeed = speedSprint;
			}
		}		
		moveSpeed = Mathf.Lerp(moveSpeed, targetSpeed, curSmooth);
	}
}

function IsGrounded 			() {												// check if player is touching the ground or a collision flag
return ( collisionFlags & CollisionFlags.CollidedBelow ) != 0;					// if isGround not equal to 0 if it doesn't equal 0
}
function SetGravity				() {												// sets gravity to 0 for ground and subtracts if in air
	if ( IsGrounded () )
		verticalSpeed = 0.0;														// stop subtracting, if player on ground set to 0
	else
		verticalSpeed -= gravity * Time.deltaTime;									// if character in air, begin moving downward
}
function Message ( text : String ) {												// debug mode handling for development - easy toggle on/off
	if ( DebugMode )
		Debug.Log ( text );
}
function Message ( text : float )  {												// debug mode handling for development - easy toggle on/off
	if ( DebugMode )
		Debug.Log ( text );
}
function Message ( text : int )    {												// debug mode handling for development - easy toggle on/off
	if ( DebugMode )
		Debug.Log ( text );
}
function AnimationClipCheck 	() {												// in debug mode, check for clip, if null, put in default ani
	if ( !DebugMode ) return;
	
	if ( aniIdle_1 			== null ) {	Debug.Log ( "Missing Animation Clip: idle_1, adding default" 			); aniIdle_1 		 = GetComponent.<Animation>().clip; }
	if ( aniIdle_2 			== null ) {	Debug.Log ( "Missing Animation Clip: idle_2, adding default"  			); aniIdle_2 		 = GetComponent.<Animation>().clip; }
	if ( aniWalk 			== null ) {	Debug.Log ( "Missing Animation Clip: walk, adding default"  			); aniWalk 	 		 = GetComponent.<Animation>().clip; }
	if ( aniJog 			== null ) {	Debug.Log ( "Missing Animation Clip: jog, adding default"  				); aniJog 			 = GetComponent.<Animation>().clip; }
	if ( aniRun 			== null ) {	Debug.Log ( "Missing Animation Clip: run, adding default"  				); aniRun 		 	 = GetComponent.<Animation>().clip; }
	if ( aniSprint 			== null ) {	Debug.Log ( "Missing Animation Clip: sprint, adding default"  			); aniSprint 		 = GetComponent.<Animation>().clip; }
	if ( aniCrouchIdle 		== null ) {	Debug.Log ( "Missing Animation Clip: crouch idle, adding default"  		); aniCrouchIdle 	 = GetComponent.<Animation>().clip; }
	if ( aniLeanLeft 		== null ) {	Debug.Log ( "Missing Animation Clip: lean left, adding default"  		); aniLeanLeft 		 = GetComponent.<Animation>().clip; }
	if ( aniLeanRight 		== null ) { Debug.Log ( "Missing Animation Clip: lean right, adding default"  		); aniLeanRight 	 = GetComponent.<Animation>().clip; }
	if ( aniJumpFromCrouch 	== null ) {	Debug.Log ( "Missing Animation Clip: jump from crouch, adding default"  ); aniJumpFromCrouch = GetComponent.<Animation>().clip; }
	if ( aniJumpFromObject 	== null ) { Debug.Log ( "Missing Animation Clip: jump from object, adding default"  ); aniJumpFromObject = GetComponent.<Animation>().clip; }
	if ( aniJump_1 			== null ) { Debug.Log ( "Missing Animation Clip: jump_1, adding default"  			); aniJump_1 		 = GetComponent.<Animation>().clip; }
	if ( aniJump_2 			== null ) {	Debug.Log ( "Missing Animation Clip: jump_2, adding default"  			); aniJump_2 		 = GetComponent.<Animation>().clip; }
	if ( aniJump_3 			== null ) {	Debug.Log ( "Missing Animation Clip: jump_3, adding default"  			); aniJump_3 		 = GetComponent.<Animation>().clip; }
	if ( aniJumpFall 		== null ) {	Debug.Log ( "Missing Animation Clip: jump fall, adding default"  		); aniJumpFall 		 = GetComponent.<Animation>().clip; }
	if ( aniJumpLand 		== null ) {	Debug.Log ( "Missing Animation Clip: jump land, adding default"  		); aniJumpLand 		 = GetComponent.<Animation>().clip; }
	if ( aniSlide 			== null ) {	Debug.Log ( "Missing Animation Clip: slide, adding default"  			); aniSlide 		 = GetComponent.<Animation>().clip; }
	if ( aniGrab	 		== null ) {	Debug.Log ( "Missing Animation Clip: grabPush, adding default"  		); aniGrab			 = GetComponent.<Animation>().clip; }
	if ( aniGrabIdle	 	== null ) {	Debug.Log ( "Missing Animation Clip: grabIdle, adding default"  		); aniGrabIdle		 = GetComponent.<Animation>().clip; }
	if ( aniPush	 		== null ) {	Debug.Log ( "Missing Animation Clip: aniPush, adding default"  			); aniPush	 		 = GetComponent.<Animation>().clip; }
}
function ExampleShowHidePlayer 	() {												// example show hide player - shown in update function 
	if ( Input.GetKeyDown ( "h" ) )													// example of showPlayer function toggle
	{
		showPlayer = !showPlayer;
		if (  showPlayer ) ShowPlayer ();											// show player (render mesh)
		if ( !showPlayer ) HidePlayer ();											// hide player (render mesh off)
	}
}
function OnTriggerEnter ( other : Collider ) {										// trigger events for coin, key, bridge, jumpPad
	
}
function OnTriggerStay  ( other : Collider ) {										// trigger event while in collider (for platforms)

}
function OnTriggerExit  ( other : Collider ) {										// trigger even when leaving collider (for platforms)

}
function OnControllerColliderHit ( hit : ControllerColliderHit ) {					// check for raycast hit from controller
	Debug.DrawRay ( hit.point, hit.normal );										// draw line showing direction of ray cast
	if ( hit.moveDirection.y > 0.01 && isJumping_3 ) 								// if player hits head (top collider) then let's move player down so it doesn't hang in the checking for jump3 as well
	{
		inAirVelocity.y = 0;														// quick fix - set player movement speed to 0, moving player back down
		Message ( "Player hit top (head) collider. Moving back down" );				// print player hit head
		return;																		// return out
	}
	if ( hit.collider.tag == jumpFromObjectTag ) 									// if hit tag is equal to the wall tag
		jumpableObject = true;														// set jump object true
	
	objectJumpContactNormal = hit.normal;											// store jumps contact normal direction	
	
	var body : Rigidbody = hit.collider.attachedRigidbody;							// set body to hit rigidbody
	
	if ( body == null || body.isKinematic )											// no rigidbody
		return;

	var bodyLayerMask : int = 1 << body.gameObject.layer;							// only push rigidbodies in the right layers or default 1
	if ( ( bodyLayerMask & pushLayers.value ) == 0 ) 								// if not on the right layers, break out
		return;	

	if ( hit.moveDirection.y < -0.3 ) 												// we dont want to push objects below us
	{
		return;										
	}		
	var pushDir : Vector3 = Vector3 ( hit.moveDirection.x, 0, hit.moveDirection.z );// calculate push direction from move direction, we only push objects to the sides, never up and down
	body.velocity = pushDir * pushPower; 											// push object based on direction and strength						
}

function OnGUI 					() {												// quick gui for coins and key display
	GUI.Box   ( Rect ( 0,0, 100, 60  ), "" );										// gui box for background	
	GUI.Label ( Rect ( 10,5,100,100  ), "Health: " + health );						// gui label to show coin and current value
	GUI.Label ( Rect ( 10,20,100,100 ), "Coins: "  + coin   );						// gui label to show coin and current value
	GUI.Label ( Rect ( 10,35,100,100 ), "Keys: "   + key    );						// gui label to show key and current value
}
