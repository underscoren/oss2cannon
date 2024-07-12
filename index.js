const { BeatmapDecoder } = require("osu-parsers")
const { ManiaRuleset, ManiaBeatmap } = require("osu-mania-stable")
const { writeFile } = require("fs/promises");

const filename = process.argv.slice(2)[0];

if(!filename || ["h", "help", "-h", "-help", "--h", "--help"].includes(filename)) {
    console.log(`oss2cannon
Usage: oss2cannon <.osu file>

Must be a 4-key mania beatmap.
Key 1 Notes = cannons
Key 1 Holds = cannon Waves
Key 4 Notes = powers`)
}

const decoder = new BeatmapDecoder();

(async () => {
    const beatmap = await decoder.decodeFromPath(filename);
    
    const ruleset = new ManiaRuleset();

    /** @type { ManiaBeatmap } */
    const maniaBeatmap = ruleset.applyToBeatmap(beatmap);

    /** @type {[string, number][]} */
    const spawnTime = [];

    for(const note of maniaBeatmap.notes) {
        if(note._column == 0)
            spawnTime.push(["spawnCannonRandom", note.startTime/1000 - 2]);

        if(note._column == 3)
            spawnTime.push(["spawnPower", note.startTime/1000]);
    }

    for(const hold of maniaBeatmap.holds) {
        spawnTime.push(["spawnCannonWave", hold.startTime/1000 - 2]);
    }

    // sort by time ascending
    spawnTime.sort((a, b) => a[1] - b[1])

    const fileContents = `"times": PackedFloat32Array(${spawnTime.map(([_,time]) => time.toFixed(2)).join(", ")}),
"transitions": PackedFloat32Array(${spawnTime.map(() => "1").join(", ")}),
"values": [${spawnTime.map(([type]) => `{
"args": [${type == "spawnPower" ? (~~(Math.random()*3)).toFixed(0) : ""}],
"method": &"${type}"
}`).join(", ")}]`


    await writeFile("spawnTimes.txt", fileContents);
})();
