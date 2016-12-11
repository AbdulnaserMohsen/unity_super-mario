/* ---This is the basic Unity Script for Lerpz police character---
// Enemy Controller 
// Walker Boys (www.walkerboystudio.com)
// November 28, 2011
// Description: Basic enemy controller for idle, find, attack, die
// Instruction: Assign script to an enemy character and supply the necessary elements in the inspector
*/

var target 							: Transform;									// who enemy is looking for

var attackTurnTime 					: float 			= 0.7;						// time to turn on attacking
var rotateSpeed 					: float 			= 120.0;					// rotational speed
var attackDistance 					: float 			= 17.0;						// distance for attacking true (gizmo)
var extraRunTime 					: float 			= 2.0;						// time to run after attacking

var attackSpeed 					: float 			= 5.0;						// speed of attack movement
var attackRotateSpeed 				: float 			= 20.0;						// speed of attack rotation

var idleTime 						: float 			= 1.6;						// time to remain idle between checking
var damageAmount 					: int 				= 25;
var hitPosition 					: Vector3 			= new Vector3 (0.4, 0, 0.7);// hit sphere position (adjustable in inspector)
var hitRadius 						: float 			= 1.1;						// hit radius size (adjustable in inspector)

var killParticle 					: Transform;									// particle to play on death
var coin							: Transform;									// coin to spawn after death

@HideInInspector																	// hides variable from inspector
var hitDirection 					: Vector3;										// direction of hit
@HideInInspector																	// hides variable from inspector
var playerHit 						: boolean 			= false;					// enable player hit

private var attackAngle 			: float 			= 10.0;						// angle to attack
private var isAttacking 			: boolean 			= false;					// enable attacking
private var lastHitTime 			: float 			= 0.0;						// last time player hit
private var offset					: Vector3;										// vector3 for offset amount
private var characterController 	: CharacterController;							// instance of character controller

characterController = GetComponent ( CharacterController );							// get characters controller component

function Start 					() {												// initialize everything
	if ( !target )																	// if no target
		target = GameObject.FindWithTag ( "Player" ).transform;						// set target to object with tag name Player
	
	GetComponent.<Animation>().wrapMode 					 = WrapMode.Loop;							// set play animation mode to loop
	GetComponent.<Animation>().Play ( "idle" );														// play idle animation
	//animation [ "targetEnemy" ].wrapMode = WrapMode.Once;							// set animation to play once
	//animation [ "walk" ].wrapMode 		 = WrapMode.Once;							// set animation to play once
	//animation [ "die" ].wrapMode  		 = WrapMode.Once;							// set animation to play once
	//animation [ "die" ].layer 			 = 1;										// set animation priority high
	
	yield WaitForSeconds ( Random.value );											// wait random amount
		
	while ( true )																	// just attack for now
	{	
		yield Idle ();																// idle till player within range		
		yield Attack ();															// rotate toward player and attack
	}
}
function Idle 					() {												// idle mode

	yield WaitForSeconds ( idleTime );												// wait during idle time

	while ( true )																	// loop tile returning out (which sets to false)
	{
		characterController.SimpleMove ( Vector3.zero );							// setup slight movement if player isn't close by
		yield WaitForSeconds ( 0.2 );
		
		offset = transform.position - target.position;								// rotate position amount (offset) betweeen it and player position
			
		if ( offset.magnitude < attackDistance )									// if distance between player and enemy is within attackDistance range
			return;																	// return out and prepare to attack
	}
} 
function Attack 				() {												// attack mode
	isAttacking = true;																// set is attacking to true

	GetComponent.<Animation>().Play ( "run" );														// play animation run
	
	var angle : float = 180.0;														// store angle value of direction
	var time  : float = 0.0;														// store time per frame

	var direction : Vector3;														// direction of object
	
	while ( angle > 5 || time < attackTurnTime )									// check on angle, till it's 5 degrees away
	{	
		time += Time.deltaTime;														// grab time frame + var time
		angle = Mathf.Abs ( RotateTowardsPosition ( target.position, rotateSpeed ) ); // rotate towards player at rotateSpeed
		move  = Mathf.Clamp01 ( ( 90 - angle ) / 90 );								// rotate between 90 degree angle
		//animation["run"].weight = animation [ "run" ].speed = move;					// begin moving if within angle
		direction = transform.TransformDirection ( Vector3.forward * attackSpeed * move );	// store transform based on forward direction, attack speed and move
		characterController.SimpleMove ( direction );								// use simple move (direction) for basic controls		
		yield;																		// yield for a frame
	}	
	var timer : float = 0.0;														// timer used to check against extra run time
	var lostSight : boolean = false;												// check for player lossing sight

	while ( timer < extraRunTime )													// check till timer completes
	{
		angle = RotateTowardsPosition ( target.position, attackRotateSpeed );		// store angle of player (between target and attack speed)

		if ( Mathf.Abs ( angle ) > 40 )												// angle of vision - larger than 40, can't see player
			lostSight = true;														// lost visual sight

		if ( lostSight )															// enable lost player
			timer += Time.deltaTime;												// store time to run just a bit longer till stop
			
		direction = transform.TransformDirection ( Vector3.forward * attackSpeed );	// move forward for a few more steps
		characterController.SimpleMove ( direction );								// move direction 

		var pos = transform.TransformPoint( hitPosition );							// store pos for current transform position
		if ( Time.time > lastHitTime + 0.3 && ( pos - target.position ).magnitude < hitRadius )	// check if we can hit player
		{			
			lastHitTime = Time.time;												// grab time for delay on next attack
		}
		if ( characterController.velocity.magnitude < attackSpeed * 0.3 ) 			// not moving forward, ran in to wall or something, stop attacking
			break;
		yield;																		// yield for one frame
	}
	GetComponent.<Animation>().CrossFade ( "idle" );													// now we can go back to playing the idle animation
}
function ApplyDamage 			() {												// play death animation
	GetComponent.<Animation>().CrossFade ( "die" );													// animation die	
	yield WaitForSeconds (.65);														// wait before instantiating
	Instantiate ( killParticle, transform.position, Quaternion.identity );			// create particle
	Instantiate ( coin, transform.position, Quaternion.identity );					// create/leave coin
	Destroy ( gameObject, .1 );														// destroy enemy
}
function OnDrawGizmosSelected 	() {												// draw gizmos if selected
	Gizmos.color = Color.yellow;													// color for sphere
	Gizmos.DrawWireSphere ( transform.TransformPoint ( hitPosition ), hitRadius );	// draw sphere
	Gizmos.color = Color.red;														// color for sphere
	Gizmos.DrawWireSphere ( transform.position, attackDistance );					// draw sphere
}
function RotateTowardsPosition ( targetPos : Vector3, rotateSpeed : float ) : float{// rotate towards player 	
	var relative : Vector3 = transform.InverseTransformPoint ( targetPos );			// compute relative point and get the angle towards it
	var angle : float = Mathf.Atan2 ( relative.x, relative.z ) * Mathf.Rad2Deg;		// store angle in degrees (x,z)
	var maxRotation : float = rotateSpeed * Time.deltaTime;							// clamp it with the max rotation speed
	var clampedAngle : float = Mathf.Clamp ( angle, -maxRotation, maxRotation );	// clamp angle between min/max
	transform.Rotate ( 0, clampedAngle, 0 );										// rotate me 
	return angle;																	// return current angle value
}
function OnTriggerEnter ( other : Collider ) {										// if collision with player
	if ( other.tag == "Player" )													// check for tag named player
	{
		ControllerColliderAttack.isAttacking = true;	// just double check that player trigger // player is 'hit', yield for 1 second, then allow enemy to 'hit' again
	}
}
