---
layout: documentation
parents: Documentation > Tutorial
title: Introduction
---

# Introduction

In this step-by-step tutorial we will be creating a simple Nintendo Virtual Boy game with VUEngine Studio.

The game we will implement is Pong, which should cover all the basic needs for a game, from stages, states and game logic to sprites and collisions. To round things off, we are also going to implement link cable support in the end, to allow for two player matches.

Eventually, our game will look like on the following screenshot:

<a href="/documentation/images/tutorial/the-game.png" data-toggle="lightbox" data-gallery="gallery"><img src="/documentation/images/tutorial/the-game.png"/></a>

So... let's get started, shall we. At first, we want to [set up a blank new project](/documentation/tutorial/project-setup/).

> **P.S.**: Most of the finished code can be found online as part of the [VUEngine-Showcase](https://github.com/VUEngine/VUEngine-Showcase) repository. The relevant bits are the following:

- [PongBallSpec](https://github.com/VUEngine/VUEngine-Showcase/tree/main/assets/Actor/Sprites/PongBall)
- [PongPaddleSpec](https://github.com/VUEngine/VUEngine-Showcase/tree/main/assets/Actor/Sprites/PongPaddle)
- [PongWallSpec](https://github.com/VUEngine/VUEngine-Showcase/tree/main/assets/Actor/Sprites/PongWall)
- [Paddle Actor](https://github.com/VUEngine/VUEngine-Showcase/tree/main/source/Actors/Actors/Paddle)
- [Ball Actor](https://github.com/VUEngine/VUEngine-Showcase/tree/main/source/Actors/Actors/PongBall)
- [Pong State](https://github.com/VUEngine/VUEngine-Showcase/tree/main/source/States/PongState)
- [Pong Stage](https://github.com/VUEngine/VUEngine-Showcase/blob/main/assets/Stage/PongStageSpec.c)
- [Pong Game Logic](https://github.com/VUEngine/VUEngine-Showcase/tree/main/source/Components/Pong)
