---
date: "2010-02-06 14:10:48"
layout: post
slug: call-for-a-new-lightweight-c-based-computer-vision-library
status: publish
title: Call for a new, lightweight, c-based computer vision library
categories:
  - post
---

Since 2005, most of my computer vision work were done with OpenCV. It is an amazingly hand-optimized piece of software. A large number of modern applications are based on OpenCV framework. It is a useful toolset. However, for all this years, I finally feel the need to make a more lightweight, pure-c/function based library. There are some ideas:

1. It should be fast. There is no need to build a toolset that is slow. Former work such as lapack and gsl are a better choices rather than reinvent the wheel. For the same reason, It is necessary to fork basic routines from OpenCV, such as Canny detector, kalman filter, etc.

2. Better memory management, cache everything. OpenCV partially implemented a memory management routine, but failed to have a cache mechanism, partly because there are too many functions and it hard to break in and add another layer.

3. Less but more about modern algorithms. Implementing a fewer but niche algorithms and give intuitive examples. Keep compatibility with OpenCV (through interpreting functions).

4. Give some love to distributed system, and modern compilers (LLVM & Clang).

I am aware of that many vision works are never made the way to mass (VLFeat for example), but that's the plan.
