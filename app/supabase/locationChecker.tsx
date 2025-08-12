import * as Network from "expo-network";
import { useState, useEffect } from "react";
import { View, Text } from "react-native";

export default function Location() {
    const [ipAddress, setIpAddress] = useState(null);
    const [networkState, setNetworkState] = useState(null);
    const [isInAustralia, setInAustralia] = useState(null);

    useEffect(() => {
        const fetchNetworkInfo = async () => {
            try {
                // 1. Get public IP
                const ipResponse = await fetch("https://api.ipify.org?format=json");
                const ipData = await ipResponse.json();
                setIpAddress(ipData.ip);

                // 2. Get location from ip-api.com
                const locationResponse = await fetch(`http://ip-api.com/json/${ipData.ip}`);
                const locationData = await locationResponse.json();

                if (locationData.country === "Australia") {
                    setInAustralia(true);
                } else {
                    setInAustralia(false);
                }

                // 3. Get network state
                const state = await Network.getNetworkStateAsync();
                setNetworkState(JSON.stringify(state));
            } catch (error) {
                console.error("Error getting network info:", error);
            }
        };

        fetchNetworkInfo();
    }, []);


    return (
        <View>
            <Text>IP Address: {ipAddress || "Loading..."}</Text>
            <Text>Network State: {networkState || "Loading..."}</Text>
            {isInAustralia !== null && (
                <Text>
                    {isInAustralia ? "You are in Australia." : "You are NOT in Australia."}
                </Text>
            )}
        </View>
    );
}
