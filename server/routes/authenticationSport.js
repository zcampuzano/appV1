const User = require('../models/user'); // Import User Model Schema
const Organization = require('../models/organization'); // Import User Model Schema
const Athlete = require('../models/athlete'); // Import User Model Schema
const Season = require('../models/season');
const Game = require('../models/game');
const GameStat = require('../models/gameStat');
const BasketballSchema = require('../models/basketball');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const passport = require('passport');

module.exports = (router, session) => {

    /* ================================================
    MIDDLEWARE - Used to grab user's token from headers
    ================================================ */
    router.use((req, res, next) => {
        const token = req.headers['authorization']; // Create token found in headers
        // Check if token was found in headers
        if (!token) {
            res.json({ success: false, message: 'No token provided' }); // Return error
        } else {
            // Verify the token is valid
            jwt.verify(token, config.secret, (err, decoded) => {
                // Check if error is expired or invalid
                if (err) {
                    res.json({ success: false, message: 'Token invalid: ' + err }); // Return error for token validation
                } else {
                    req.decoded = decoded; // Create global variable to use in any request beyond
                    next(); // Exit middleware
                }
            });
        }
    });

    /* ==============
          Create BasketballSchema Route
       ============== */
    router.post('/createBasketballSchema', (req, res) => {
        let basketballSchema = new BasketballSchema({
            PTA2 : 0, PTM2: 0, PTA3 : 0, AST : 0, BLK : 0, DRB : 0, FTA : 0, FTM : 0, ORB : 0, PF : 0,
            STL : 0, TO : 0, ASTPG : 0, STLPG : 0, PTP2 : 0, PTP3 : 0, AST_TO_RATIO : 0, BLKPG : 0, FGP : 0,
            FGA : 0, FGM : 0, FTP : 0, GP : 0, MINPG : 0, OPP : 0, OPPG : 0, PFPG : 0, PPG : 0, RPG : 0,
            TOPG : 0, MIN : 0, PTS : 0, TRB : 0, FF : 0, TECHF : 0, DQ : 0, GS : 0, TF : 0, W : 0, L : 0, T : 0
        });

        User.findOne({ _id: req.decoded.userId }).select('organization').exec((err, organID) => {
            if (err) {
                res.json({ success: false, message: err }); // Return error
            } else {
                if (!organID) {
                    res.json({ success: false, message: 'We do not have any organizations' }); // Return error, organs was not found in db
                } else {
                    Organization.findOne({ _id: organID.organization }).select('seasons').exec((err, seasons) => {
                        if (err) {
                            res.json({ success: false, message: err });
                        } else {
                            console.log(seasons);
                            if (!seasons) {
                                res.json({ success: false, message: 'No seasons' });
                            } else {
                                BasketballSchema.createBasketballSchema(basketballSchema, function(err){
                                    if (err) {
                                        if (err.errors) {
                                            // Check if validation error is in the email field
                                            if (err.errors.PTA2) {
                                                res.json({ success: false, message: err.errors.PTA2.message }); // Return error
                                            }
                                        } else {
                                            res.json({ success: false, message: 'Could not save BasketballSchema. Error: ', err }); // Return error if not related to validation
                                        }
                                    } else {
                                        res.json({ success: true, message: 'BasketballSchema registered!', organID : organID.organization,
                                            basketballSchemaID: basketballSchema._id, seasons : seasons }); // Return success
                                    }
                                });
                            }
                        }
                    })

                }
            }
        })
    });



    /* ==============
        Create Season Route
     ============== */
    router.post('/createSeason', (req, res) => {
        if (!req.body.year) {
            res.json({ success: false, message: 'Please provide a year'});
        }
        let season = new Season({
            year: req.body.year,
            basketballStat: req.body.basketballStat,
            athletes: req.body.athletes,
            games: req.body.games
        });
        Season.createSeason(season, function(err){
            if (err) {
                if (err.errors) {
                    // Check if validation error is in the email field
                    if (err.errors.year) {
                        res.json({ success: false, message: err.errors.year.message }); // Return error
                    } else {
                        // Check if validation error is in the username field
                        if (err.errors.basketballStat) {
                            res.json({ success: false, message: err.errors.basketballStat.message}); // Return error
                        } else {
                            if (err.errors.athletes) {
                                res.json({ success : false, message : err.errors.athletes.message});
                            } else {
                                if (err.errors.games) {
                                    res.json({success: false, message: err.errors.games.message});
                                }
                            }
                        }
                    }
                } else {
                    res.json({ success: false, message: 'Could not save season. Error: ', err }); // Return error if not related to validation
                }
            } else {
                res.json({ success: true, message: 'Season registered!', seasonYear: season.year, seasonID: season._id }); // Return success
            }
        });
    });

    /* ==============
        Create Game Route
     ============== */
    router.post('/createGame', (req, res) => {
        if(!req.body.date) {
            res.json({ success: false, message: 'Please provide a date'});
        } else {
            if(!req.body.athletes) {
                res.json({ success: false, message: 'No players selected'});
            } else {
                if (!req.body.home) {
                    res.json({success: false, message: 'No home team indicated'});
                }
                if (!req.body.away) {
                    res.json({ success: false, message: 'No away team indicated'});
                }
            }
        }

        let game = new Game({
            date: req.body.date,
            athletes: req.body.athletes,
            home: req.body.home,
            away: req.body.away
        });

        Game.createGame(game, function(err){
            if (err) {
                if (err.errors) {
                    // Check if validation error is in the email field
                    if (err.errors.date) {
                        res.json({ success: false, message: err.errors.date.message }); // Return error
                    } else {
                        // Check if validation error is in the username field
                        if (err.errors.athletes) {
                            res.json({ success: false, message: err.errors.athletes.message}); // Return error
                        } else {
                            if (err.errors.home) {
                                res.json({ success : false, message : err.errors.home.message});
                            } else {
                                if (err.errors.away) {
                                    res.json({success: false, message: err.errors.away.message});
                                }
                            }
                        }
                    }
                } else {
                    res.json({ success: false, message: 'Could not save game. Error: ', err }); // Return error if not related to validation
                }
            } else {
                res.json({ success: true, message: 'Game registered!', gameDate: game.date }); // Return success
            }
        });

    });

    /* ==============
        Create GameStat Route
     ============== */
    router.post('/createGameStat', (req, res) => {
        if (!req.body.athlete) {
            res.json({success: false, message: 'No athlete'})
        }
        let gameStat = new GameStat({
            athlete : req.body.athlete,
            PTA2 : 0, PTM2 : 0, PTA3 : 0, AST : 0, BLK : 0, DRB : 0,
            FTA : 0, FTM : 0, ORB : 0, PF : 0, STL : 0, TO : 0
        });

        //todo change from zeros

        GameStat.createGameStat(gameStat, function(err){
            if (err) {
                if (err.errors) {
                    // Check if validation error is in the email field
                    if (err.errors.athlete) {
                        res.json({ success: false, message: err.errors.athlete.message }); // Return error
                    }
                } else {
                    res.json({ success: false, message: 'Could not save GameStat. Error: ', err }); // Return error if not related to validation
                }
            } else {
                res.json({ success: true, message: 'GameStat registered!',
                    gameStatID: gameStat._id }); // Return success
            }
        });

    });

    /* ==============
        Create Athlete Route
     ============== */
    router.post('/createAthlete', (req, res) => {
        if (!req.body.firstname) {
            res.json({ success: false, message: 'Please provide a first name'});
        } else {
            if (!req.body.lastname) {
                res.json({success: false, message: 'Please provide a last name'});
            } else {
                if (!req.body.organization) {
                    res.json({success: false, message: 'You must provide a organization'});
                }
            }
        }
        let athlete = new Athlete({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            number: req.body.number,
            position: req.body.position,
            basketballStat: req.body.basketballStat,
            organization: req.body.organization
        });
        Athlete.createAthlete(athlete, function(err){
            if (err) {
                if (err.errors) {
                    // Check if validation error is in the email field
                    if (err.errors.firstname) {
                        res.json({ success: false, message: err.errors.firstname.message }); // Return error
                    } else {
                        // Check if validation error is in the username field
                        if (err.errors.lastname) {
                            res.json({ success: false, message: err.errors.lastname.message}); // Return error
                        } else {
                            if (err.errors.basketballStat) {
                                res.json({ success : false, message : err.errors.basketballStat.message});
                            } else {
                                {
                                    if (err.errors.organization) {
                                        res.json({ success : false, message : err.errors.organization.message});
                                    }
                                }
                            }
                        }
                    }
                } else {
                    res.json({ success: false, message: 'Could not save athlete. Error: ', err }); // Return error if not related to validation
                }
            } else {
                res.json({ success: true, message: 'Athlete registered!', athleteFirstName: athlete.firstname, athleteID: athlete._id }); // Return success
            }
        });
    });


    /* ===============================================================
       Route to get all athletes
    =============================================================== */
    router.get('/getAthletes', (req, res) => {
        User.findOne({ _id: req.decoded.userId }).select('organization').exec((err, organID) => {
            if (err) {
                res.json({success: false, message: err}); // Return error
            } else {
                if (!organID) {
                    res.json({success: false, message: 'We do not have any organizations'}); // Return error, organs was not found in db
                } else {
                    Athlete.find({ organization: organID.organization }).select('firstname lastname number position _id').exec((err, allAthlete) => {
                        if (err) {
                            res.json({success: false, message: err}); // Return error
                        } else {
                            if (!allAthlete) {
                                res.json({success: false, message: 'We do not have any athletes'}); // Return error, organs was not found in db
                            } else {
                                res.json({success: true, athleteList: allAthlete})
                            }
                        }
                    })
                }
            }
        })
    });


    /* ===============================================================
       Route to get user
    =============================================================== */
    router.get('/getUser/:id', (req, res) => {
        console.log(req.params.id)
        User.findOne({ _id: req.params.id }).select('firstname lastname').exec((err, user) => {
            if (err) {
                res.json({ success: false, message: err }); // Return error
            } else {
                if (!user) {
                    res.json({ success: false, message: 'We do not have any users' }); // Return error, organs was not found in db
                } else {
                    res.json({ success : true, user : user})
                }
            }
        })
    });

    /* ===============================================================
      Route to get one athlete
   =============================================================== */
    router.get('/getAthlete/:id', (req, res) => {
        // console.log(req.params.id)
        Athlete.findOne({ _id: req.params.id }).select('firstname lastname basketballStat').exec((err, athlete) => {
            if (err) {
                res.json({ success: false, message: err }); // Return error
            } else {
                if (!athlete) {
                    res.json({ success: false, message: 'We do not have any athletes' }); // Return error, organs was not found in db
                } else {
                    res.json({ success : true, athlete : athlete})
                }
            }
        })
    });

    /* ===============================================================
      Route to get one BasketballStat
   =============================================================== */
    router.get('/getBasketballStat/:id', (req, res) => {
        console.log("bball id : ", req.params.id)
        BasketballSchema.findOne({ _id: req.params.id }).exec((err, basketballSchema) => {
            if (err) {
                res.json({ success: false, message: err }); // Return error
            } else {
                if (!basketballSchema) {
                    res.json({ success: false, message: 'We do not have any basketballSchemas' }); // Return error, organs was not found in db
                } else {
                    res.json({ success : true, basketballSchema : basketballSchema})
                }
            }
        })
    });

    /* ==============
        Update Season Roster
     ============== */

    router.post('/updateSeasonRoster', (req, res) => {
        if (!req.body.seasonID) {
            console.log("no ID");
        }
        Season.findOneAndUpdate(
            {"_id": req.body.seasonID},
            {
                "$push": {
                    athletes: req.body.athleteID
                }
            },
            {"new": true, "upsert": true},
            function (err, doc) {
                if (err) {
                    res.json({ success: false, message: 'Could not add athlete to season roster' }); // Return error
                    throw err;
                }
                console.log(doc);
                res.json({ success: true, firstname: doc.athletes });
            }
        );
    });

    /* =================================
        Update organization with Season
     ================================= */
    router.post('/updateOrganSeason', (req, res) => {
       if (!req.body.organID) {
           console.log("no ID");
       }
       Organization.findOneAndUpdate(
           {"_id": req.body.organID},
           {
               "$push": {
                   seasons: req.body.seasonID
               }
           },
           {"new": true, "upsert": true},
           function (err, doc) {
               if (err) {
                   res.json({ success: false, message: 'Could not add season to organization' }); // Return error
                   throw err;
               }
               console.log(doc);
               res.json({ success: true, firstname: doc.seasons });
           }
       );
    });


    /* ===============================================================
    Route to change Athlete Info
  =============================================================== */
    router.post('/changeAthlete', (req, res) => {
        if (!req.body.identity) {
            console.log("no ID");
        }
        Athlete.findOneAndUpdate(
            {"_id": req.body.identity},
            {
                "$set": {
                    firstname: req.body.newFirstname,
                }
            },
            {"new": true, "upsert": true},
            function (err, doc) {
                if (err) {
                    res.json({ success: false, message: 'Could not change athlete field' }); // Return error, organs was not found in db
                    throw err;
                }
                console.log(doc);
                res.json({ success: true, firstname: doc.firstname });
            }
        );
    });

    /* ===============================================================
   Route to change BasketballSchema Info
  =============================================================== */
    router.post('/changeBasketballSchema', (req, res) => {
        if (!req.body.identity) {
            console.log("no ID");
        }
        BasketballSchema.findOneAndUpdate(
            {"_id": req.body.identity},
            {
                "$set": {
                    // number : req.body.number,
                    PTA2 : req.body.PTA2,
                    PTM2 : req.body.PTM2,
                    PTA3 : req.body.PTA3,
                    AST : req.body.AST,
                    BLK : req.body.BLK,
                    DRB : req.body.DRB,
                    FTA : req.body.FTA,
                    FTM : req.body.FTM,
                    ORB : req.body.ORB,
                    PF : req.body.PF,
                    STL : req.body.STL,
                    TO : req.body.TO,
                    ASTPG : req.body.ASTPG,
                    STLPG : req.body.STLPG,
                    PTP2 : req.body.PTP2,
                    PTP3 : req.body.PTP3,
                    AST_TO_RATIO : req.body.AST_TO_RATIO,
                    BLKPG : req.body.BLKPG,
                    FGP : req.body.FGP,
                    FGA : req.body.FGA,
                    FGM : req.body.FGM,
                    FTP : req.body.FTP,
                    GP : req.body.GP,
                    MINPG : req.body.MINPG,
                    OPP : req.body.OPP,
                    OPPG : req.body.OPPG,
                    PFPG : req.body.PFPG,
                    PPG : req.body.PPG,
                    RPG : req.body.RPG,
                    TOPG : req.body.TOPG,
                    MIN : req.body.MIN,
                    PTS : req.body.PTS,
                    TRB : req.body.TRB,
                    FF : req.body.FF,
                    TECHF : req.body.TECHF,
                    DQ : req.body.DQ,
                    GS : req.body.GS,
                    TF : req.body.TF,
                    W : req.body.W,
                    L : req.body.L,
                    T : req.body.T
                }
            },
            {"new": false, "upsert": false},
            function (err, doc) {
                if (err) {
                    res.json({ success: false, message: 'Could not change athlete field' }); // Return error, organs was not found in db
                    throw err;
                }
                console.log(doc);
                res.json({ success: true, newSchema: doc});
            }
        );
    });



    return router; // Return router object to main index.js
};