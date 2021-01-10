# NatyaML

[Live Page](https://dance-project.glitch.me)

## Inspiration

My first introduction to ML using javascript was through this hackathon. When I attended the Magenta.js workshop, one thing that drew my attention was the application of quantized steps to dictate the rhythm of the music. The idea that musical rhythm can be broken down into the number of beats per measure is probably familiar to all musicians. This concept also connected with me in the scope of dance.

I have been learning Bharatanatyam since I was six years old. Bharatanatyam is the oldest form of classical Indian dance, and it combines precise rhythmic movements with expressive gestures to convey both dance and drama. As a long-time dancer, I am familiar with the precision with which dance steps are mathematically arranged within the music. The concept of quantized steps got me thinking of how it can be applied to choreograph a Bharatanatyam dance to music, thus inspiring Natya\*ML.

## What it does

NatyaML has two parts: music and dance. The music is entirely ML-generated, and the user can pick which sound they would like to hear (mridangam #1, mridangam #2, violin, or harp) and which key they would like their music to be in. For the dance portion, I've created a library of 8 steps. The user may choose to loop over any of the steps, essentially viewing each step over and over again. The other option is to auto-choreograph a dance. The steps are chosen to go along with the beats of the music. Regardless of which option is chosen by the user, the canvas displays a recording of each step along with the skeletal rendering.

## How I built it

The music was constructed using Tone.js and MusicRNN from Magenta.js. The skeletal rendering of the dancer was created using PoseNet from ml5.js.

## Challenges I ran into

I had just started learning JavaScript this summer, and I had no prior experience with Tone.js, Magenta.js, or ml5.js before this hackathon, so I ran into a lot of challenges. My first challenge was creating the auto-generation of the music. My next challenge was having the generated music vary based on the user's input. Next, I faced challenges working with PoseNet. It took me a while to get the auto-choreograph working and to collect the PoseNet data. I also then started working with BodyPix from ml5.js. When I tried to put PoseNet and BodyPix together, I experienced a lot of lag. My machine couldn't handle both of them running at once, and while I would have liked to go farther with that, I was constrained due to this problem.

## Accomplishments that I'm proud of

I am immensely proud of how much I accomplished. Considering that I started the hackathon with no knowledge of Tone.js, Magenta.js, and ml5.js, and very minimal experience with HTML and CSS, I'm so proud that I was able to learn this much and create NatyaML. I'm also really happy that I was able to combine my 11 years of dancing and 8 years of learning piano with programming to create NatyaML. I never really considered how much art can come into play with programming.

## What I learned

Nearly everything you see in NatyaML is something I learned about during this hackathon. This has been an amazing learning experience for me.

## What's next for NatyaML

I want to expand upon the video library of steps. There are about 175 steps in Bharatanatyam. Due to time and resource constraints, I only included 8. However, given more resources and time, I would include more. Also, if I were given more resources, I would want to integrate BodyPix and PoseNet to create a rendering of a dancer on a cool background.
