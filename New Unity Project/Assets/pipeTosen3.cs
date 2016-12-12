using UnityEngine;
using System.Collections;

public class pipeTosen3 : MonoBehaviour {

	// Use this for initialization
	void Start () {
	
	}
	
	// Update is called once per frame
	void Update () {
	
	}
    void OnCollisionEnter(Collision other)
    {
        Application.LoadLevel("sen3");
    }

}
