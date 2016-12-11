/* ---Unity Script---
// Collision Sound Effect 
// Walker Boys (www.walkerboystudio.com)
// November 28, 2011
// Description: Creates a script to hold a reference to an audioclip to play when the player hits it
// Instruction: Assign script to any floor object player is walking on - can be different for each ground type.
// 				The "Foot" script (which is attached to the player) looks for this script on whatever it touches.
// 				If it finds it, then it will play the sound when the foot comes in contact
*/

var audioClip 		: AudioClip;
var volumeModifier  : float 	= 1.0;
