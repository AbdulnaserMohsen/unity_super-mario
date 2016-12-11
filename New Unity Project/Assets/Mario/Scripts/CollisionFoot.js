/* ---Unity Script---
// Collision Foot 
// Walker Boys (www.walkerboystudio.com)
// November 28, 2011
// Description: Checks for player foot collisions and creates sound/particle based on trigger
// Instruction: Assign script to player 'Foot' - both left and right
*/

var baseFootAudioVolume 		: float 	= 1.0;																// audio volume
var soundEffectPitchRandomness 	: float 	= 0.05;																// pitch level rnd

function OnTriggerEnter ( other : Collider ) {																	// collision enters
	var collisionParticleEffect : CollisionParticleEffect = other.GetComponent ( CollisionParticleEffect );		// get particle effect
	
	if ( collisionParticleEffect ) 																				// if theres an effect
	{
		Instantiate ( collisionParticleEffect.effect, transform.position, transform.rotation );					// create the particle 
	}
	
	var collisionSoundEffect : CollisionSoundEffect = other.GetComponent ( CollisionSoundEffect );				// get sound effect

	if ( collisionSoundEffect ) 																				// if theres a sound
	{
		GetComponent.<AudioSource>().clip	 = collisionSoundEffect.audioClip;															// set clip to this clip
		GetComponent.<AudioSource>().volume = collisionSoundEffect.volumeModifier * baseFootAudioVolume;								// set volume
		GetComponent.<AudioSource>().pitch  = Random.Range ( 1.0 - soundEffectPitchRandomness, 1.0 + soundEffectPitchRandomness );		// set pitch
		GetComponent.<AudioSource>().Play ();																							// play audio file
	}
}
function Reset () {																								// reset function
	GetComponent.<Rigidbody>().isKinematic = true;																				// enable isKinematic
	GetComponent.<Collider>().isTrigger = true;																					// enable isTrigger
}

@script RequireComponent(AudioSource, SphereCollider, Rigidbody)												// require three components
