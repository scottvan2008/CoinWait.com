import { NextResponse } from "next/server";
import { db } from "../../lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function GET() {
    try {
        console.log("Fetching Bitcoin block height...");
        const response = await fetch(
            "https://blockstream.info/api/blocks/tip/height"
        );
        const blockHeight = parseInt(await response.text(), 10);

        console.log("Fetched block height:", blockHeight);

        // Halving happens every 210,000 blocks
        const halvingBlock = 840000; // Block where next halving occurs
        const blocksPerHalving = 210000;

        let nextHalvingBlock;

        // Calculate the next halving block
        if (blockHeight < halvingBlock) {
            nextHalvingBlock = halvingBlock;
        } else {
            // Calculate next halving multiple of 210,000 blocks
            const halvingsPassed = Math.floor(
                (blockHeight - halvingBlock) / blocksPerHalving
            );
            nextHalvingBlock =
                halvingBlock + (halvingsPassed + 1) * blocksPerHalving;
        }

        // Calculate the remaining blocks to the next halving
        const blocksRemaining = nextHalvingBlock - blockHeight;

        // Bitcoin block interval (10 minutes per block)
        const minutesPerBlock = 10;

        // Calculate time remaining (in minutes) for the next halving
        const remainingTimeInMinutes = blocksRemaining * minutesPerBlock;

        // Calculate the exact halving time (in milliseconds)
        const currentTime = Date.now();
        const halvingTime = currentTime + remainingTimeInMinutes * 60000; // in milliseconds

        // Format halvingTime to "YYYY/MM/DD HH:mm:ss UTC"
        const date = new Date(halvingTime);
        const formattedHalvingTime =
            date.toISOString().replace("T", " ").slice(0, 19) + " UTC";

        // Store both block height and halving time in Firestore
        await setDoc(doc(db, "bitcoin", "latest"), {
            height: blockHeight,
            halvingTime: formattedHalvingTime,
            nextHalvingBlock: nextHalvingBlock,
            updatedAt: serverTimestamp(),
        });

        console.log("Updated Firestore successfully with halving time!");
        return NextResponse.json({
            height: blockHeight,
            halvingTime: formattedHalvingTime,
            remainingTimeInMinutes,
            nextHalvingBlock,
        });
    } catch (error) {
        console.error("Error fetching block height:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
