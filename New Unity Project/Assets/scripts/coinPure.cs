using UnityEngine;
using System.Collections;

public class coinPure : MonoBehaviour {

    public AudioClip sound;
    AudioSource audio;
    // Use this for initialization
    void Start ()
    {
        audio = GetComponent<AudioSource>();

    }
	
	// Update is called once per frame
	void Update ()
    {

	
	}
    void OnCollisionEnter(Collision other)
    {
        audio.Play();
        Destroy(gameObject, .4f);

    }
}
