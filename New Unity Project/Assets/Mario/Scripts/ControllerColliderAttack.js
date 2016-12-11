static var isAttacking : boolean = false;											// toggle for attack mode

function OnTriggerEnter ( other : Collider ) {										// trigger events for collider on foot
	if ( other.tag == "enemy" ) 													// if collider equals enemy object
	{
		isAttacking = true;															// enable attacking 
		other.GetComponent ( EnemyController ).ApplyDamage ();						// apply damage state to enemy
	}
}
function OnTriggerExit ( other : Collider ) {										// on exit of trigger
	if ( other.tag == "enemy" )														// check for tag name enemy
	{
		isAttacking = false;														// disable attacking
	}
}
