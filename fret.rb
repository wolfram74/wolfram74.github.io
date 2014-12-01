# intent: to print out an ascii fret board and mark it with scales or chords or transpositions.
# step 1: make a blank board. My ultralight is marked up to 21, may as well. (include 0, will need 22 slots.)
# give each fret space 3 blanks to work with. ---|, say.
# indexing: larger numbers mean higher frequency, so thickest to thinnest is 0-5.
class FretBoard
  attr_accessor :kneck
  @@western_scale_note = {"a"=>0,"A"=>1,"b"=>2,"c"=>3,"C"=>4,
    "d"=>5,"D"=>6,"e"=>7,"f"=>8,"F"=>9,"g"=>10,"G"=>11}
  @@western_scale_mag = ["a","A","b","c","C","d","D","e","f","F","g","G"]
  def initialize()
    @kneck = Array.new(6) {Array.new(22) {"---"}}
    @fret_values = Array.new(6) {Array.new(22) {0}}
    @kneck.length.times do |str|
      @kneck[str].length.times do |fret|
        value= 7+fret
        value += str*5 if str <4
        value += (str-1)*5 +4 if str >=4
        @fret_values[str][fret]=value
      end
    end
  end

  def clean()
    initialize
  end

  def print_kneck()
    22.times {|i| print "%4d" % i}
    print "\n"
    6.times do |string|
      print "%d" % (5-string) #5-string is because the 0th indexed is actually lowest.
      22.times do |fret|
        print @kneck[5-string][fret]+"|"
      end
      print "\n"
    end
  end

  def s_f_to_magnitude()
    #the western system is base 12 and the guitar strings are +5, with the exception of 3 to 4, which is +4.
    @kneck.length.times do |str|
      @kneck[str].length.times do |fret|
        value= @fret_values[str][fret]
        tens, ones = value/10, value %10
        @kneck[str][fret][1]=tens.to_s
        @kneck[str][fret][2]=ones.to_s
      end
    end
  end

  def place_scale(root, space, mark = root)
    # bad_root = !( @@western_scale_mag.include?(root) )
    # bad_space = !( [0,1,2].include?(space) )
    if !( @@western_scale_mag.include?(root) ) || !( [0,1,2].include?(space) )
      raise ArgumentError.new("musical system insufficiently imaginative")
    end
    print "setting up the %s major scale...\n" % root
    major_progression = [0,2,4,5,7,9,11,12]
    notes = major_progression.map{ |n| (@@western_scale_note[root]+n) % 12}
    # p notes
    6.times do |str|
      22.times do |fret|
        part_of_scale = notes.include? @fret_values[str][fret] % 12
        @kneck[str][fret][space] = mark if part_of_scale
      end
    end
  end
end

test_board=FretBoard.new()
test_board.print_kneck
# test_board.kneck[0][0][1]="E"
# test_board.print_kneck
# test_board.s_f_to_magnitude
# test_board.print_kneck
# test_board.clean
# p test_board.western_scale["a"]
# test_board.place_scale("e",0, "X")
# test_board.print_kneck
test_board.place_scale("g",2, "X")

test_board.print_kneck
test_board.place_scale("d",0, "O")

test_board.print_kneck
