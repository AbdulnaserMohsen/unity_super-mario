using UnityEngine;
using System.Collections;

public class unvisableCube : MonoBehaviour {

    Renderer rend;
    public AudioClip sound;
    AudioSource audio;
    // Use this for initialization
    void Start ()
    {
        rend = GetComponent<Renderer>();
        audio = GetComponent<AudioSource>();

    }
	
	// Update is called once per frame
	void Update ()
    {
	
	}

    void OnCollisionEnter(Collision other)
    {
        if (!rend.enabled)
        {
            audio.Play();
            rend.enabled = true;
        }
    }

}
