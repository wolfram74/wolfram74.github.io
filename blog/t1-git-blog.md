A Bit of Git for the non-Twit

Or: How Many Words Rhyme with Git?

02014/10/28

So there you sit, humming along life at a steady clip, when all of a sudden you're hit. You've got this idea and the need to make it real is tremendous. So you get to it. You start slamming keys, one fervent mitt after the other on the board. Prudently you save frequently, occassionally you have the discipline to revise, but past experiences of unintended consequences makes your teeth grit when you do that. This is happening for awhile until you get to part where you need techniques you're unfamiliar with and a friend becomes interested.

They join you in this slowly growing pit of code and emails flit back and forth. It starts out fine, but then the snags hit. It becomes harder and harder to figure out which change was where and when a file needs to be replaced with an altered one. Suddenly some change borked the whole thing. You can't figure out where the crit fail was rolled and large swathes of code are unsalvagable.

Now I stand in the bully pulpit to tell you: This is why you should use version control. In general it can be thought of as a more extensive saving. In particular, git tracks changes in the project. I suspect that it is entirely based on changes, and doesn't have dozens or hundreds copies of full projects. You tweak the bytes in your project bit by bit and then when you think it's a good change, when it's fit to commit, you log that change to the record and carry on. Each change is given a unique ID and then if you want to revert to a previous state it can generate them. So this helps in at least two ways, one: the algorithm handles keeping track of changes, be they from one, ten or a hundred people. Two: disasters are substantially mitigated. Now, it's a system with a limit, so there are ways to do irrevocable damage, but it's much harder to unintnetionally destroy a project.

git has built into it functionality allowing it work across multiple computers, allowing you to check in one place to see what work other people might have done as opposed to many, reducing collaboration costs. While it is possible to set up your own server to do this, perhaps for the security conscious amongst you, there exist several pre-existing services that will take the hosting load off your hands. A prominent one in the open source community is Github. The default options are for public repositories, so if you like to see your projects writ large across the whole internet it's the place for you. This way you can share it and bring more people in to work on it more easily.