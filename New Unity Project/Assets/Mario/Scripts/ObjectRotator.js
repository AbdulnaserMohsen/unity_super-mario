/*
// Object Rotator 
// Walker Boys (www.walkerboystudio.com)
// November 28, 2011
// Description: Rotates a gameObject around the y axis (could provide inspector options for axis selection and speed)
// Instruction: Assign script to any gameObject you want to spin (coins, keys, etc)
*/

function Update () 										// updates
{
	transform.Rotate ( 0, 45 * Time.deltaTime, 0 );		// rotate object on the Y
}
