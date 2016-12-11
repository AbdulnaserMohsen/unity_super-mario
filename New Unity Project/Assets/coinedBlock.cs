using UnityEngine;
using System.Collections;

public class coinedBlock : MonoBehaviour
{
    int score = 0;

    // Use this for initialization
    void Start()
    {
        

    }

    // Update is called once per frame
    void Update()
    {

    }
    void OnCollisionEnter(Collision other)
    {
        score++;
    }
    void OnGUI()
    {
        GUI.Label(new Rect(10, 10, 100, 20), "score :    "+score);
    }
}