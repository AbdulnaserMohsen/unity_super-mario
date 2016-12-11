/*
// Plant Animation 
// Walker Boys (www.walkerboystudio.com)
// November 28, 2011
// Description: Animates a plant on trigger event
// Instruction: Assign script to a plant (or object that has 'wiggle' as an animation label)
*/

function Start () {									// initialize things
	GetComponent(Animation).Stop ();				// be sure it ani starts off stopped
}
function OnTriggerEnter ( col : Collider ) {		// if player runs through trigger area
	GetComponent(Animation).Play ( "wiggle" );	// play the animation file
}
