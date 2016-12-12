using UnityEngine;
using System.Collections;

public class coinedBlock : MonoBehaviour
{
    GUIText gu;
    public int score;
    Renderer rend;
    public Texture tex;
    public AudioClip sound;
    AudioSource audio;

    // Use this for initialization
    void Start()
    {
        score = 0;
        rend = GetComponent<Renderer>();
        audio = GetComponent<AudioSource>();

    }

    // Update is called once per frame
    void Update()
    {
        OnGUI();
    }
    void OnCollisionEnter(Collision other)
    {
        
        if (rend.material.mainTexture != tex)
        {
            score++;
            audio.Play();
            OnGUI();
        }
            
        
        rend.material.mainTexture = tex ;
          
    }

    void OnGUI()
    {
        GUI.Label(new Rect(10, 10, 100, 20), new GUIContent(score.ToString()));
        //GUILayout.Label(" Found : " + score.ToString());
    }
}