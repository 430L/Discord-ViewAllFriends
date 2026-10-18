(() => {
    const relationshipStore = Vencord.Webpack.Common.RelationshipStore;
    const userStore = Vencord.Webpack.findByProps("getUser", "getCurrentUser");

    if (relationshipStore) {
        const relationships = typeof relationshipStore.getRelationships === 'function' 
            ? relationshipStore.getRelationships() 
            : (relationshipStore._getRelationships ? relationshipStore._getRelationships() : relationshipStore.getState?.()?.relationships);

        if (relationships) {
            // filter out friends (type 1)
            const friendIDs = Object.entries(relationships)
                .filter(([_, type]) => type === 1 || type?.type === 1)
                .map(([id, _]) => id);

            logFriends(friendIDs, userStore);
            return;
        }
    }

    const fallbackStore = Vencord.Webpack.findByProps("getFriendIDs");
    if (fallbackStore?.getFriendIDs) {
        logFriends(fallbackStore.getFriendIDs(), userStore);
    } else {
        console.error("Could not trace relationship dictionary layout.");
    }

    function logFriends(friendIDs, uStore) {
        console.log(`%cTotal Friends: ${friendIDs.length}`, "color: #4822ce; font-size: 18px; font-weight: bold;");
        
        if (!uStore) {
            console.warn("UserStore not found. Cannot fetch usernames. Here are the IDs instead:", friendIDs);
            return;
        }

        console.groupCollapsed("%cFriends List:", "color: #4822ce; font-weight: bold;");
        friendIDs.forEach(id => {
            const user = uStore.getUser(id);
            if (user) {
                // shows whatever username(s) are available
                const displayName = user.globalName ? `"${user.globalName}" (@${user.username})` : `@${user.username}`;
                console.log(`%c- ${displayName}`, "color: #4aaeff;");
            } else {
                console.log(`%c- Unknown User (${id})`, "color: #80848E;");
            }
        });
        console.groupEnd();
    }
})();