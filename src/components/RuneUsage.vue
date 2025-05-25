<template>
    <div id="RuneUsage" v-if="reloader">
        <!-- <label for="rank-select">Rank: </label>
        <select id="rank-select" v-model="rank" @change="calculatePercentages">
            <option value="all">all</option>
            <option value="IRON">Iron</option>
            <option value="BRONZE">Bronze</option>
            <option value="GOLD">Gold</option>
            <option value="PLATINUM">Platinum</option>
            <option value="EMERALD">Emerald</option>
            <option value="DIAMOND">Diamond</option>
            <option value="MASTER">Master</option>
            <option value="GRANDMASTER">Grandmaster</option>
            <option value="CHALLENGER">Challenger</option>
            <option value="PLATINUM+">Platinum+</option>
            <option value="EMERALD+">Emerald+</option>
            <option value="DIAMOND+">Diamond+</option>
            <option value="MASTER+">Master+</option>
            <option value="GRANDMASTER+">Grandmaster+</option>
        </select> -->
        <h1>Primary rune usage</h1>
        <div class="all-primaries">
            <div class="primary-style" id="precision">
                <div class="row">
                    <div class="primary-item">
                        <img :src="runeToImgPath[8005]" :style="{ filter: primaryStyleUsage[8005] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8005]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="primary-item">
                        <img :src="runeToImgPath[8008]" :style="{ filter: primaryStyleUsage[8008] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8008]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="primary-item">
                        <img :src="runeToImgPath[8021]" :style="{ filter: primaryStyleUsage[8021] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8021]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="primary-item">
                        <img :src="runeToImgPath[8010]" :style="{ filter: primaryStyleUsage[8010] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8010]?.toFixed(1) || "-" }}%</span>
                    </div>
                </div>
                <div id="prec-subs">
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[9101]" :style="{ filter: primarySubUsage[9101] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ primarySubUsage[9101]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[9104]" :style="{ filter: primarySubUsage[9104] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ primarySubUsage[9104]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8014]" :style="{ filter: primarySubUsage[8014] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ primarySubUsage[8014]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[9111]" :style="{ filter: primarySubUsage[9111] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ primarySubUsage[9111]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[9105]" :style="{ filter: primarySubUsage[9105] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ primarySubUsage[9105]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8017]" :style="{ filter: primarySubUsage[8017] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ primarySubUsage[8017]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[8009]" :style="{ filter: primarySubUsage[8009] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ primarySubUsage[8009]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[9103]" :style="{ filter: primarySubUsage[9103] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ primarySubUsage[9103]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8299]" :style="{ filter: primarySubUsage[8299] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ primarySubUsage[8299]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="primary-style">
                <div class="column">
                    <div class="primary-item">
                        <img :src="runeToImgPath[8112]" :style="{ filter: primaryStyleUsage[8112] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8112]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8126]" :style="{ filter: primarySubUsage[8126] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8126]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8137]" :style="{ filter: primarySubUsage[8137] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8137]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8135]" :style="{ filter: primarySubUsage[8135] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8135]?.toFixed(1) || "-" }}%</span>
                    </div>
                </div>
                <div class="column">
                    <div class="primary-item">
                        <img :src="runeToImgPath[8128]" :style="{ filter: primaryStyleUsage[8128] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8128]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8139]" :style="{ filter: primarySubUsage[8139] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8139]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8140]" :style="{ filter: primarySubUsage[8140] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8140]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8105]" :style="{ filter: primarySubUsage[8105] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8105]?.toFixed(1) || "-" }}%</span>
                    </div>
                </div>
                <div class="column">
                    <div class="primary-item">
                        <img :src="runeToImgPath[9923]" :style="{ filter: primaryStyleUsage[9923] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[9923]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8143]" :style="{ filter: primarySubUsage[8143] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8143]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8141]" :style="{ filter: primarySubUsage[8141] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8141]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8106]" :style="{ filter: primarySubUsage[8106] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8106]?.toFixed(1) || "-" }}%</span>
                    </div>
                </div>
            </div>
            <div class="primary-style">
                <div class="column">
                    <div class="primary-item">
                        <img :src="runeToImgPath[8214]" :style="{ filter: primaryStyleUsage[8214] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8214]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8224]" :style="{ filter: primarySubUsage[8224] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8224]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8210]" :style="{ filter: primarySubUsage[8210] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8210]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8237]" :style="{ filter: primarySubUsage[8237] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8237]?.toFixed(1) || "-" }}%</span>
                    </div>
                </div>
                <div class="column">
                    <div class="primary-item">
                        <img :src="runeToImgPath[8229]" :style="{ filter: primaryStyleUsage[8229] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8229]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8226]" :style="{ filter: primarySubUsage[8226] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8226]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8234]" :style="{ filter: primarySubUsage[8234] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8234]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8232]" :style="{ filter: primarySubUsage[8232] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8232]?.toFixed(1) || "-" }}%</span>
                    </div>
                </div>
                <div class="column">
                    <div class="primary-item">
                        <img :src="runeToImgPath[8230]" :style="{ filter: primaryStyleUsage[8230] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8230]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8275]" :style="{ filter: primarySubUsage[8275] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8275]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8233]" :style="{ filter: primarySubUsage[8233] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8233]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8236]" :style="{ filter: primarySubUsage[8236] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8236]?.toFixed(1) || "-" }}%</span>
                    </div>
                </div>
            </div>
            <div class="primary-style">
                <div class="column">
                    <div class="primary-item">
                        <img :src="runeToImgPath[8437]" :style="{ filter: primaryStyleUsage[8437] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8437]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8446]" :style="{ filter: primarySubUsage[8446] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8446]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8429]" :style="{ filter: primarySubUsage[8429] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8429]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8451]" :style="{ filter: primarySubUsage[8451] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8451]?.toFixed(1) || "-" }}%</span>
                    </div>
                </div>
                <div class="column">
                    <div class="primary-item">
                        <img :src="runeToImgPath[8439]" :style="{ filter: primaryStyleUsage[8439] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8439]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8463]" :style="{ filter: primarySubUsage[8463] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8463]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8444]" :style="{ filter: primarySubUsage[8444] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8444]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8453]" :style="{ filter: primarySubUsage[8453] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8453]?.toFixed(1) || "-" }}%</span>
                    </div>
                </div>
                <div class="column">
                    <div class="primary-item">
                        <img :src="runeToImgPath[8465]" :style="{ filter: primaryStyleUsage[8465] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8465]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8401]" :style="{ filter: primarySubUsage[8401] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8401]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8473]" :style="{ filter: primarySubUsage[8473] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8473]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8242]" :style="{ filter: primarySubUsage[8242] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8242]?.toFixed(1) || "-" }}%</span>
                    </div>
                </div>
            </div>
            <div class="primary-style">
                <div class="column">
                    <div class="primary-item">
                        <img :src="runeToImgPath[8351]" :style="{ filter: primaryStyleUsage[8351] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8351]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8306]" :style="{ filter: primarySubUsage[8306] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8306]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8313]" :style="{ filter: primarySubUsage[8313] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8313]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8347]" :style="{ filter: primarySubUsage[8347] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8347]?.toFixed(1) || "-" }}%</span>
                    </div>
                </div>
                <div class="column">
                    <div class="primary-item">
                        <img :src="runeToImgPath[8360]" :style="{ filter: primaryStyleUsage[8360] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8360]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8304]" :style="{ filter: primarySubUsage[8304] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8304]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8352]" :style="{ filter: primarySubUsage[8352] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8352]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8410]" :style="{ filter: primarySubUsage[8410] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8410]?.toFixed(1) || "-" }}%</span>
                    </div>
                </div>
                <div class="column">
                    <div class="primary-item">
                        <img :src="runeToImgPath[8369]" :style="{ filter: primaryStyleUsage[8369] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primaryStyleUsage[8369]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8321]" :style="{ filter: primarySubUsage[8321] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8321]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8345]" :style="{ filter: primarySubUsage[8345] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8345]?.toFixed(1) || "-" }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[8316]" :style="{ filter: primarySubUsage[8316] > 1 ? 'none' : 'grayscale(100%)' }"/>
                        <span>{{ primarySubUsage[8316]?.toFixed(1) || "-" }}%</span>
                    </div>
                </div>
            </div>
        </div>
        <div id="secondary-shards">
            <div>
            <h1>Secondary rune usage</h1>
            <div class="all-secondaries">
                <div class="secondary-style">
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[9101]" :style="{ filter: secondarySubUsage[9101] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[9101]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[9104]" :style="{ filter: secondarySubUsage[9104] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[9104]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8014]" :style="{ filter: secondarySubUsage[8014] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8014]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[9111]" :style="{ filter: secondarySubUsage[9111] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[9111]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[9105]" :style="{ filter: secondarySubUsage[9105] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[9105]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8017]" :style="{ filter: secondarySubUsage[8017] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8017]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[8009]" :style="{ filter: secondarySubUsage[8009] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8009]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[9103]" :style="{ filter: secondarySubUsage[9103] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[9103]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8299]" :style="{ filter: secondarySubUsage[8299] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8299]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                </div>
                <div class="secondary-style">
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[8126]" :style="{ filter: secondarySubUsage[8126] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8126]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8137]" :style="{ filter: secondarySubUsage[8137] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8137]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8135]" :style="{ filter: secondarySubUsage[8135] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8135]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[8139]" :style="{ filter: secondarySubUsage[8139] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8139]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8140]" :style="{ filter: secondarySubUsage[8140] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8140]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8105]" :style="{ filter: secondarySubUsage[8105] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8105]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[8143]" :style="{ filter: secondarySubUsage[8143] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8143]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8141]" :style="{ filter: secondarySubUsage[8141] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8141]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8106]" :style="{ filter: secondarySubUsage[8106] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8106]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                </div>
                <div class="secondary-style">
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[8224]" :style="{ filter: secondarySubUsage[8224] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8224]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8210]" :style="{ filter: secondarySubUsage[8210] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8210]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8237]" :style="{ filter: secondarySubUsage[8237] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8237]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[8226]" :style="{ filter: secondarySubUsage[8226] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8226]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8234]" :style="{ filter: secondarySubUsage[8234] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8234]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8232]" :style="{ filter: secondarySubUsage[8232] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8232]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[8275]" :style="{ filter: secondarySubUsage[8275] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8275]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8233]" :style="{ filter: secondarySubUsage[8233] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8233]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8236]" :style="{ filter: secondarySubUsage[8236] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8236]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                </div>
                <div class="secondary-style">
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[8446]" :style="{ filter: secondarySubUsage[8446] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8446]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8429]" :style="{ filter: secondarySubUsage[8429] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8429]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8451]" :style="{ filter: secondarySubUsage[8451] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8451]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[8463]" :style="{ filter: secondarySubUsage[8463] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8463]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8444]" :style="{ filter: secondarySubUsage[8444] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8444]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8453]" :style="{ filter: secondarySubUsage[8453] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8453]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[8401]" :style="{ filter: secondarySubUsage[8401] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8401]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8473]" :style="{ filter: secondarySubUsage[8473] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8473]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8242]" :style="{ filter: secondarySubUsage[8242] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8242]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                </div>
                <div class="secondary-style">
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[8306]" :style="{ filter: secondarySubUsage[8306] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8306]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8313]" :style="{ filter: secondarySubUsage[8313] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8313]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8347]" :style="{ filter: secondarySubUsage[8347] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8347]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[8304]" :style="{ filter: secondarySubUsage[8304] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8304]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8352]" :style="{ filter: secondarySubUsage[8352] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8352]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8410]" :style="{ filter: secondarySubUsage[8410] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8410]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                    <div class="column">
                        <div class="item">
                            <img :src="runeToImgPath[8321]" :style="{ filter: secondarySubUsage[8321] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8321]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8345]" :style="{ filter: secondarySubUsage[8345] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8345]?.toFixed(1) || "-" }}%</span>
                        </div>
                        <div class="item">
                            <img :src="runeToImgPath[8316]" :style="{ filter: secondarySubUsage[8316] > 1 ? 'none' : 'grayscale(100%)' }"/>
                            <span>{{ secondarySubUsage[8316]?.toFixed(1) || "-" }}%</span>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            <div>
            <h1>Shard usage</h1>
            <div id="stat-mods">
                <div id="offense" class="stat-mods-item">
                    <div class="item">
                        <img :src="runeToImgPath[5008]" />
                        <span>{{ offenseUsage[5008]?.toFixed(1) || 0 }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[5005]" />
                        <span>{{ offenseUsage[5005]?.toFixed(1) || 0 }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[5007]" />
                        <span>{{ offenseUsage[5007]?.toFixed(1) || 0 }}%</span>
                    </div>
                </div>
                <div id="flex" class="stat-mods-item">
                    <div class="item">
                        <img :src="runeToImgPath[5008]" />
                        <span>{{ flexUsage[5008]?.toFixed(1) || 0 }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[5010]" />
                        <span>{{ flexUsage[5010]?.toFixed(1) || 0 }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[5001]" />
                        <span>{{ flexUsage[5001]?.toFixed(1) || 0 }}%</span>
                    </div>
                </div>
                <div id="defense" class="stat-mods-item">
                    <div class="item">
                        <img :src="runeToImgPath[5011]" />
                        <span>{{ defenseUsage[5011]?.toFixed(1) || 0 }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[5013]" />
                        <span>{{ defenseUsage[5013]?.toFixed(1) || 0 }}%</span>
                    </div>
                    <div class="item">
                        <img :src="runeToImgPath[5001]" />
                        <span>{{ defenseUsage[5001]?.toFixed(1) || 0 }}%</span>
                    </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { ref } from "vue";

export default{
    name: "ChampDetail",
    props: {
        runes: {
            type: Object as () => {[rank: string]: {[runes: string]: number}},
            required: true
        }
    },
    setup(){
        var rank = ref("all");
        var runeToImgPath: {[rune: number]: string} = {
            5001: "perk-images/StatMods/StatModsHealthPlusIcon.png",
            5011: "perk-images/StatMods/StatModsHealthScalingIcon.png",
            5013: "perk-images/StatMods/StatModsTenacityIcon.png",
            5008: "perk-images/StatMods/StatModsAdaptiveForceIcon.png",
            5010: "perk-images/StatMods/StatModsMovementSpeedIcon.png",
            5005: "perk-images/StatMods/StatModsAttackSpeedIcon.png",
            5007: "perk-images/StatMods/StatModsCDRScalingIcon.png",
            8005: "perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png",
            8008: "perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png",
            8010: "perk-images/Styles/Precision/Conqueror/Conqueror.png",
            8021: "perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png",
            8009: "perk-images/Styles/Precision/PresenceOfMind/PresenceOfMind.png",
            9101: "perk-images/Styles/Precision/AbsorbLife/AbsorbLife.png",
            9111: "perk-images/Styles/Precision/Triumph.png",
            9103: "perk-images/Styles/Precision/LegendBloodline/LegendBloodline.png",
            9104: "perk-images/Styles/Precision/LegendAlacrity/LegendAlacrity.png",
            9105: "perk-images/Styles/Precision/LegendHaste/LegendHaste.png",
            8014: "perk-images/Styles/Precision/CoupDeGrace/CoupDeGrace.png",
            8017: "perk-images/Styles/Precision/CutDown/CutDown.png",
            8299: "perk-images/Styles/Sorcery/LastStand/LastStand.png",
            8112: "perk-images/Styles/Domination/Electrocute/Electrocute.png",
            8128: "perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png",
            9923: "perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png",
            8126: "perk-images/Styles/Domination/CheapShot/CheapShot.png",
            8139: "perk-images/Styles/Domination/TasteOfBlood/GreenTerror_TasteOfBlood.png",
            8143: "perk-images/Styles/Domination/SuddenImpact/SuddenImpact.png",
            8137: "perk-images/Styles/Domination/SixthSense/SixthSense.png",
            8140: "perk-images/Styles/Domination/GrislyMementos/GrislyMementos.png",
            8141: "perk-images/Styles/Domination/DeepWard/DeepWard.png",
            8105: "perk-images/Styles/Domination/RelentlessHunter/RelentlessHunter.png",
            8106: "perk-images/Styles/Domination/UltimateHunter/UltimateHunter.png",
            8135: "perk-images/Styles/Domination/TreasureHunter/TreasureHunter.png",
            8214: "perk-images/Styles/Sorcery/SummonAery/SummonAery.png",
            8229: "perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png",
            8230: "perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png",
            8224: "perk-images/Styles/Sorcery/NullifyingOrb/Axiom_Arcanist.png",
            8226: "perk-images/Styles/Sorcery/ManaflowBand/ManaflowBand.png",
            8275: "perk-images/Styles/Sorcery/NimbusCloak/6361.png",
            8210: "perk-images/Styles/Sorcery/Transcendence/Transcendence.png",
            8233: "perk-images/Styles/Sorcery/AbsoluteFocus/AbsoluteFocus.png",
            8234: "perk-images/Styles/Sorcery/Celerity/CelerityTemp.png",
            8232: "perk-images/Styles/Sorcery/Waterwalking/Waterwalking.png",
            8236: "perk-images/Styles/Sorcery/GatheringStorm/GatheringStorm.png",
            8237: "perk-images/Styles/Sorcery/Scorch/Scorch.png",
            8351: "perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png",
            8360: "perk-images/Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png",
            8369: "perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png",
            8304: "perk-images/Styles/Inspiration/MagicalFootwear/MagicalFootwear.png",
            8306: "perk-images/Styles/Inspiration/HextechFlashtraption/HextechFlashtraption.png",
            8321: "perk-images/Styles/Inspiration/CashBack/CashBack2.png",
            8313: "perk-images/Styles/Inspiration/PerfectTiming/AlchemistCabinet.png",
            8345: "perk-images/Styles/Inspiration/BiscuitDelivery/BiscuitDelivery.png",
            8352: "perk-images/Styles/Inspiration/TimeWarpTonic/TimeWarpTonic.png",
            8316: "perk-images/Styles/Inspiration/JackOfAllTrades/JackofAllTrades2.png",
            8347: "perk-images/Styles/Inspiration/CosmicInsight/CosmicInsight.png",
            8410: "perk-images/Styles/Resolve/ApproachVelocity/ApproachVelocity.png",
            8437: "perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png",
            8439: "perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png",
            8465: "perk-images/Styles/Resolve/Guardian/Guardian.png",
            8401: "perk-images/Styles/Resolve/MirrorShell/MirrorShell.png",
            8446: "perk-images/Styles/Resolve/Demolish/Demolish.png",
            8463: "perk-images/Styles/Resolve/FontOfLife/FontOfLife.png",
            8429: "perk-images/Styles/Resolve/Conditioning/Conditioning.png",
            8444: "perk-images/Styles/Resolve/SecondWind/SecondWind.png",
            8473: "perk-images/Styles/Resolve/BonePlating/BonePlating.png",
            8242: "perk-images/Styles/Sorcery/Unflinching/Unflinching.png",
            8451: "perk-images/Styles/Resolve/Overgrowth/Overgrowth.png",
            8453: "perk-images/Styles/Resolve/Revitalize/Revitalize.png",
        }

        var defenseUsage: {[runes: string]: number} = {};
        var flexUsage: {[runes: string]: number} = {};
        var offenseUsage: {[runes: string]: number} = {};

        var primaryStyleUsage: {[runes: string]: number} = {};
        var primarySubUsage: {[runes: string]: number} = {};
        
        var secondarySubUsage: {[runes: string]: number} = {};

        var reloader = ref(false);

        return {
            rank,
            runeToImgPath,
            defenseUsage,
            flexUsage,
            offenseUsage,
            primaryStyleUsage,
            primarySubUsage,
            secondarySubUsage,
            reloader
        }
    },
    methods: {
        setRank(rank: string){
            this.rank = rank
            this.calculatePercentages()
            this.$forceUpdate()
        },
        sortDictByCustomOrder(
            dict: { [key: number]: string },
            order: number[]
        ): { [key: number]: string } {
            const sortedDict: { [key: number]: string } = {};
            for (const key of order) {
                if (key in dict) {
                sortedDict[key] = dict[key];
                }
            }
            return sortedDict;
        },

        calculatePercentages() {
            this.reloader = false;

            var rankRunes: {[runes: string]: number} = {};
            if (this.rank === "all") {
                rankRunes = {
                    ...this.runes["all"]
                };
            }
            if (this.rank === "IRON") {
                rankRunes = {
                    ...this.runes["IRONI"],
                    ...this.runes["IRONII"],
                    ...this.runes["IRONIII"],
                    ...this.runes["IRONIV"]
                };
            }
            if (this.rank === "BRONZE") {
                rankRunes = {
                    ...this.runes["BRONZEI"],
                    ...this.runes["BRONZEII"],
                    ...this.runes["BRONZEIII"],
                    ...this.runes["BRONZEIV"]
                };
            }
            if (this.rank === "GOLD") {
                rankRunes = {
                    ...this.runes["GOLDI"],
                    ...this.runes["GOLDII"],
                    ...this.runes["GOLDIII"],
                    ...this.runes["GOLDIV"]
                };
            }
            if (this.rank === "PLATINUM") {
                rankRunes = {
                    ...this.runes["PLATINUMI"],
                    ...this.runes["PLATINUMII"],
                    ...this.runes["PLATINUMIII"],
                    ...this.runes["PLATINUMIV"]
                };
            }
            if (this.rank === "EMERALD") {
                rankRunes = {
                    ...this.runes["EMERALDI"],
                    ...this.runes["EMERALDII"],
                    ...this.runes["EMERALDIII"],
                    ...this.runes["EMERALDIV"]
                };
            }
            if (this.rank === "DIAMOND") {
                rankRunes = {
                    ...this.runes["DIAMONDI"],
                    ...this.runes["DIAMONDII"],
                    ...this.runes["DIAMONDIII"],
                    ...this.runes["DIAMONDIV"]
                };
            }
            if (this.rank === "MASTER") {
                rankRunes = {
                    ...this.runes["MASTERI"]
                };
            }
            if (this.rank === "GRANDMASTER") {
                rankRunes = {
                    ...this.runes["GRANDMASTERI"]
                };
            }
            if (this.rank === "CHALLENGER") {
                rankRunes = {
                    ...this.runes["CHALLENGERI"]
                };
            }
            if (this.rank === "PLATINUM+") {
                rankRunes = {
                    ...this.runes["PLATINUMI"],
                    ...this.runes["PLATINUMII"],
                    ...this.runes["PLATINUMIII"],
                    ...this.runes["PLATINUMIV"],
                    ...this.runes["EMERALDI"],
                    ...this.runes["EMERALDII"],
                    ...this.runes["EMERALDIII"],
                    ...this.runes["EMERALDIV"],
                    ...this.runes["DIAMONDI"],
                    ...this.runes["DIAMONDII"],
                    ...this.runes["DIAMONDIII"],
                    ...this.runes["DIAMONDIV"],
                    ...this.runes["MASTERI"],
                    ...this.runes["GRANDMASTERI"],
                    ...this.runes["CHALLENGERI"]
                };
            }
            if (this.rank === "EMERALD+") {
                rankRunes = {
                    ...this.runes["EMERALDI"],
                    ...this.runes["EMERALDII"],
                    ...this.runes["EMERALDIII"],
                    ...this.runes["EMERALDIV"],
                    ...this.runes["DIAMONDI"],
                    ...this.runes["DIAMONDII"],
                    ...this.runes["DIAMONDIII"],
                    ...this.runes["DIAMONDIV"],
                    ...this.runes["MASTERI"],
                    ...this.runes["GRANDMASTERI"],
                    ...this.runes["CHALLENGERI"]
                };
            }
            if (this.rank === "DIAMOND+") {
                rankRunes = {
                    ...this.runes["DIAMONDI"],
                    ...this.runes["DIAMONDII"],
                    ...this.runes["DIAMONDIII"],
                    ...this.runes["DIAMONDIV"],
                    ...this.runes["MASTERI"],
                    ...this.runes["GRANDMASTERI"],
                    ...this.runes["CHALLENGERI"]
                };
            }
            if (this.rank === "MASTER+") {
                rankRunes = {
                    ...this.runes["MASTERI"],
                    ...this.runes["GRANDMASTERI"],
                    ...this.runes["CHALLENGERI"]
                };
            }
            if (this.rank === "GRANDMASTER+") {
                rankRunes = {
                    ...this.runes["GRANDMASTERI"],
                    ...this.runes["CHALLENGERI"]
                };
            }

            var totalPages = 0;

            var defenseUsage: {[runes: string]: number} = {};
            var flexUsage: {[runes: string]: number} = {};
            var offenseUsage: {[runes: string]: number} = {};

            var primaryStyleUsage: {[runes: string]: number} = {};
            var primarySubUsage: {[runes: string]: number} = {};
            
            var secondarySubUsage: {[runes: string]: number} = {};

            for (var runeString in rankRunes) {
                var runeList = runeString.split(", ");
                for (var i = 0; i < runeList.length; i++) {
                    var runeParts = runeList[i].split(": ");
                    var runeName = runeParts[runeParts.length - 1];
                    var runeNameParts = runeName.split("}");
                    runeList[i] = runeNameParts[0];
                }
                runeList.pop();

                defenseUsage[runeList[0]] = defenseUsage[runeList[0]] || 0;
                defenseUsage[runeList[0]] += rankRunes[runeString];

                flexUsage[runeList[1]] = flexUsage[runeList[1]] || 0;
                flexUsage[runeList[1]] += rankRunes[runeString];

                offenseUsage[runeList[2]] = offenseUsage[runeList[2]] || 0;
                offenseUsage[runeList[2]] += rankRunes[runeString];

                primaryStyleUsage[runeList[3]] = primaryStyleUsage[runeList[3]] || 0;
                primaryStyleUsage[runeList[3]] += rankRunes[runeString];

                primarySubUsage[runeList[4]] = primarySubUsage[runeList[4]] || 0;
                primarySubUsage[runeList[4]] += rankRunes[runeString];
                primarySubUsage[runeList[5]] = primarySubUsage[runeList[5]] || 0;
                primarySubUsage[runeList[5]] += rankRunes[runeString];
                primarySubUsage[runeList[6]] = primarySubUsage[runeList[6]] || 0;
                primarySubUsage[runeList[6]] += rankRunes[runeString];

                secondarySubUsage[runeList[7]] = secondarySubUsage[runeList[7]] || 0;
                secondarySubUsage[runeList[7]] += rankRunes[runeString];
                secondarySubUsage[runeList[8]] = secondarySubUsage[runeList[8]] || 0;
                secondarySubUsage[runeList[8]] += rankRunes[runeString];

                totalPages += rankRunes[runeString];
            }

            for (var rune in defenseUsage) {
                defenseUsage[rune] = (defenseUsage[rune] / totalPages) * 100;
            }
            for (var rune in flexUsage) {
                flexUsage[rune] = (flexUsage[rune] / totalPages) * 100;
            }
            for (var rune in offenseUsage) {
                offenseUsage[rune] = (offenseUsage[rune] / totalPages) * 100;
            }
            for (var rune in primaryStyleUsage) {
                primaryStyleUsage[rune] = (primaryStyleUsage[rune] / totalPages) * 100;
            }
            for (var rune in primarySubUsage) {
                primarySubUsage[rune] = (primarySubUsage[rune] / totalPages) * 100;
            }
            for (var rune in secondarySubUsage) {
                secondarySubUsage[rune] = (secondarySubUsage[rune] / totalPages) * 100;
            }

            this.defenseUsage = defenseUsage;
            this.flexUsage = flexUsage;
            this.offenseUsage = offenseUsage;
            this.primaryStyleUsage = primaryStyleUsage;
            this.primarySubUsage = primarySubUsage;
            this.secondarySubUsage = secondarySubUsage;

            
            this.reloader = true; // Trigger re-render
        }
    },
    mounted(){
        this.calculatePercentages();
    }
}


</script>

<style scoped>
#stat-mods {
    display: flex;
    flex-direction: column;
    align-items: center;
    /* margin-top: 20px; */
    
}

#secondary-shards {
    display: flex;
    flex-direction: space-between;
    align-items: center;
    
}

.stat-mods-item {
    display: flex;
    justify-content: space-evenly;
    /* margin-top: 10px; */
}

.primary-style, .secondary-style {
    display: flex;
    justify-content: space-evenly;
    /* margin-top: 10px; */
    border: 1px solid #434343;
}

.primary-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.primary-item img {
    width: 100px;
    height: 100px;
}

.all-primaries {
    display: flex;
    flex-direction: space-evenly;
    align-items: center;
    width: 100%;
}

.all-secondaries {
    display: flex;
    flex-direction: space-evenly;
    margin-right: 100px;
}

.sub-row {
    display: flex;
    justify-content: space-between;
    /* margin-top: 10px; */
}

.column {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 10px;
    margin-right: 10px;
    
}

.row {
    display: flex;
    justify-content: space-between;
    /* margin-top: 10px; */
}

#precision {
    display: flex;
    flex-direction: column;
    align-items: center;
}

#prec-subs {
    display: flex;
    justify-content: space-evenly;
    width: 100%;
}

.item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 10px;
}

.item img {
    width: 50px;
    height: 50px;
}

</style>