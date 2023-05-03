<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\Question;
use App\Models\Test_input;
use App\Models\Test_output;
use App\Models\Game_question;
use App\Models\User_game;
use App\Models\User;
use App\Models\Tutorial_question;
use App\Models\Tutorial_test_input;
use App\Models\Tutorial_test_output;

class TutorialController extends Controller
{
    /**
     * This function creates the relationship between the game and all the users from the lobby
     * @return array $allTutorials contains id and title from each level of the tutorial 
     */     
    public function getTutorials()
    {   
        //MARTI TIENES QUE PASARME EL TOKEN O NULL SI NO HAY TOKEN, TIENE QUE SER POST
        //Primero comprobar si el usuario está logueado
        //Si no está logueado hacer todo lo de abajo
        //Si está logueado habrá que utilizar user_tutorial y devolver locked y passed, poner la primera pregunta en locked = false
        $allTutorials = [];

        //Get all the tutorial questions
        $getTutorial = Tutorial_question::get();
        
        //Get only id and title from each question
        for ($i=0; $i < count($getTutorial); $i++) { 
            $tutorial = (object)[
                'id' => $getTutorial[$i] -> id,
                'title' => $getTutorial[$i] -> title
            ];
        
            array_push($allTutorials, $tutorial);
        }

        return response() -> json($allTutorials);
    } 
    
    /**
     * This function creates the relationship between the game and all the users from the lobby
     * @param int $id is question id
     * @return object $tutorial contains id, statement, hint, inputs and outputs from the tutorial question. 
     */       
    public function getTutorialFromId(Request $request)
    {
        $tutorialQuestion = Tutorial_question::where("id", $request -> id) -> first();
        $inputs = [];
        $outputs = [];
        $getInputs = Tutorial_test_input::where('question_id', $tutorialQuestion -> id)->get();
        $getOutputs = Tutorial_test_output::where('question_id', $tutorialQuestion -> id)->get();

        for ($j = 0; $j < count($getInputs); $j++) { 
            $inputs[$j] = unserialize($getInputs[$j] -> input);
            $outputs[$j] = unserialize($getOutputs[$j] -> output);
        }

        $tutorial = (object)[
            'id' => $tutorialQuestion -> id,
            'statement' => $tutorialQuestion -> statement,
            'hint' => $tutorialQuestion -> hint,
            'inputs' => $inputs,
            'outputs' => $outputs
        ];

        return response() -> json($tutorial);
    }  

    /**
     * This function is triggered each time a user responds to a question from the game, it will check whether the user answers the question correctly or not
     * @param bool $evalPassed determines whether the user has passed all the internal tests for the question correctly or not
     * @param int $idQuestion is the id of the question that has been answered
     * @param array $evalRes contains all the results from the evals (done in front) for each input test
     * @param int $idUser is the id from the user that is currently answering the question
     * @return object $returnObject contains the boolean 'correct' which determines if the question has indeed been answered correctly, 'testsPassed' is the number of tests that have been passed, if 'correct' is true it will mean that all tests have been passed, 'user_game' contains all the information in the relationship between game and user, therefore here we can see information like 'hearts_remaining' (the amount of hearts remaining) and 'question_at' (which question is the user at now) and 'game' which contains the id from the winner and the game id.
     */     
    public function checkAnswer(Request $request)
    {
        //MARTI TIENES QUE PASARME EL TOKEN O NULL SI NO HAY TOKEN, TIENE QUE SER POST
        //Todo esto es si el usuario no está logueado habrá que modificar user_tutorial si el usuario está logueado
        $returnObject = (object) [
            'correct'=> true,
            'testsPassed' => 0,
        ];

        //If any of the tests doesn't pass we return that it's not a correct answer.
        if ($request -> evalPassed) {
            $outputs = [];
            $getOutputs = Tutorial_test_output::where('question_id', $request -> idQuestion)->get();
            for ($i = 0; $i < count($getOutputs); $i++) { 
                $outputs[$i] = unserialize($getOutputs[$i] -> output);
            }

            foreach($outputs as $key => $val) {
                if ($val == $request -> evalRes[$key]) {
                    $returnObject -> testsPassed++;
                } else {
                    $returnObject -> correct = false;
                }
            }

        } else {
            $returnObject -> correct = false;
        }

        return response() -> json($returnObject);
    }       
}