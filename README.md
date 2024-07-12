# oss2cannon

A simple script for converting osu!mania beatmaps into a godot animation track internal data structure.

I was working on a little game and I wanted to time some things to the music. This was just a learning project, and the godot animation tools didn't provide enough functionality to time things very well.

Instead of making a custom editor, I realised I could use osu's already very good beatmap editor. Osu's beatmap file format is [well documented](https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29) and several already well made [parsers](https://github.com/nojhamster/osu-parser) exist.

The code is not very useful for anyone other than me, but the idea might prove useful in the future.