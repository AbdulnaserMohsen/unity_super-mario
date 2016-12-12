using UnityEngine;
using System.Collections;

public class airBlockCoined : MonoBehaviour {

    public AudioClip sound;
    AudioSource audio;
    public Texture tex;
    Renderer rend;
    int i = 0;

    // Use this for initialization
    void Start ()
    {
        rend = GetComponent<Renderer>();
        audio = GetComponent<AudioSource>();

    }
	
	// Update is called once per frame
	void Update () {
	
	}

    void OnCollisionEnter(Collision other)
    {
        if(i<5)
        {
            audio.Play();
            i++;
        }


        if (i>=5)
        {
            rend.material.mainTexture = tex;
        }
    }
    
}
