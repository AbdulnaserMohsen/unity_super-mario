using UnityEngine;
using System.Collections;

public class airBlick : MonoBehaviour {

    public AudioClip soundair;
    AudioSource audio;
    bool done = false;

    // Use this for initialization
    void Start ()
    {
        audio = GetComponent<AudioSource>();

    }
	
	// Update is called once per frame
	void Update () {
	
	}
    void OnCollisionEnter(Collision other)
    {
        audio.Play();
        Destroy(gameObject,.4f );
            
    }

}
