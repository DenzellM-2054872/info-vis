<template>
    <div class="content">
        <nav>
            <RouterLink to="/">About</RouterLink>
            <RouterLink to="/champscatter">Champ Scatter</RouterLink>
            <RouterLink to="/synergy">Teambuilder</RouterLink>
            <RouterLink to="/champdetail">Champ Details</RouterLink>
            <RouterLink to="/gamedetail">Game Details</RouterLink>
        </nav>
        <div class="about">
            <h1>About This Project</h1>
            <p>This project is a visualisation tool for data from the game leage of legends.</p>
            <p>The collected data is from the patches 15.7, 15.8 and 15.9, the dataset includes games from each region and every rank.</p>
            <p>The data was collected using the league api, due to the size of the dataset the data has been precompiled into diffrent files which we show on this site</p>
            <ul>
                <li><strong>Champ Scatter:</strong> Visualize champion statistics and performance.</li>
                <li><strong>Teambuilder:</strong> Create and analyze team compositions.</li>
                <li><strong>Champion Details:</strong> Get in-depth information about individual champions.</li>
                <li><strong>Game Details:</strong> Review game win rate based of off in game events.</li>
            </ul>
            <p>This tool was created by Atilla Belgen, Yoshua Coene and Denzell Mgbokwere as part of the info-vis course at Hasselt University</p>
            <br>
            <p>This tool isn't endorsed by Riot Games and doesn't reflect the views or opinions of Riot Games or anyone officially involved in producing or managing Riot Games properties. </p>
            <p>Riot Games, and all associated properties are trademarks or registered trademarks of Riot Games, Inc. </p>
          </div>
    </div>
</template>

<style>
.about {

    margin: 0 auto;
    padding: 20px;
    color: white;
}
</style>
