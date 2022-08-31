import random
import math
from matplotlib import pyplot
'''
the problem lies in how you would deal with continuous functions that have maxima in the middle of their ranges.
range for an ideal projectile on a flat plane is given in terms of v0 and theta
xf = v0^2*sin(2*theta)/g
if you know v0 exactly and have an error in theta, sigTheta, this produces
sigXf = sigTheta*2v0^2*cos(2*theta)/g

'''

def trajectory_histogram(theta):
    sigTheta = math.pi/40
    x_max = land(theta)
    data = [land(theta + random.gauss(0, sigTheta))
        for i in range(100000) ]
    # print data
    # pyplot.hist(data, 300, normed=1, range=[9.01, 10.01])
    pyplot.hist(data, 100, normed=1, range=[9,10])
    pyplot.grid(True)
    pyplot.show()
    pass

def land(theta):
    v0 = 10
    g = 10
    return v0**2*math.sin(2*theta)/g
for i in range(1,3):
    print "pi * %d/8" % i
    trajectory_histogram(i * math.pi/8)
