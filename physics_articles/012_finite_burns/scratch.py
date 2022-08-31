import numpy
import scipy

solver = scipy.integrate.RK45

def gravity(t, state):
	#assuming a static central potential
	output = numpy.zeros(4)
	r = numpy.sqrt(state[0]**2+state[1]**2)
	rcubed = r**3

	output[:2] = state[2:]
	output[2:] = -state[:2]/rcubed
	# print(output)
	return output

def burn_pattern(duration, thrust):
	def engine(t, state):
		output = numpy.zeros(4)
		v_hat = state[2:]/(numpy.linalg.norm(state[2:]))
		if t < duration:
			output[2:]+=thrust*v_hat
		return output
	return engine

def validators(state):
	# print(sum(state[:2]**2))
	# print(sum(state[2:]**2))
	print(.5*sum(state[:2]**2)-sum(state[2:]**2)**(-.5))
	return

def driver():
	tau = (2*numpy.pi)
	#init_cond = numpy.array([1,0,0,1]) # circle
	# t_max = tau

	init_cond = numpy.array([1,0,0,1]) # hohman transfer
	t_max = tau*(1.5**3)**(0.5)
	# print(gravity(0, init_cond))
	
	deltav = (4/3)**.5-1
	duration = t_max/100
	thrust = deltav/duration
	print('duration %f: thurst %f' % (duration, thrust))

	driving = burn_pattern(duration, thrust)
	def force(t, state):
		return gravity(t, state)+driving(t, state)


	solved_path = solver(
		force, t0=0, y0=init_cond, t_bound=t_max,
		rtol = 10**-5
		)
	
	while solved_path.t < t_max:
		solved_path.step()
		print(solved_path.t, solved_path.y)
		validators(solved_path.y)

def main():
	pass

if __name__ == '__main__':
	driver()
	# main()