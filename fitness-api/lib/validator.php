<?php

class Validator {

    public function validateEntry($data) {
        $errors = [];

        // Weight validation
        if (!isset($data['weight'])) {
            $errors['weight'] = 'Weight is required';
        } elseif (!is_numeric($data['weight'])) {
            $errors['weight'] = 'Weight must be a number';
        } elseif ($data['weight'] <= 0 || $data['weight'] > 500) {
            $errors['weight'] = 'Weight must be between 0 and 500 lbs';
        }

        // Steps validation
        if (!isset($data['steps'])) {
            $errors['steps'] = 'Steps is required';
        } elseif (!is_numeric($data['steps']) || $data['steps'] != (int)$data['steps']) {
            $errors['steps'] = 'Steps must be an integer';
        } elseif ($data['steps'] < 0 || $data['steps'] > 100000) {
            $errors['steps'] = 'Steps must be between 0 and 100000';
        }

        // Clean eating score validation
        if (!isset($data['clean_eating_score'])) {
            $errors['clean_eating_score'] = 'Clean eating score is required';
        } elseif (!is_numeric($data['clean_eating_score'])) {
            $errors['clean_eating_score'] = 'Clean eating score must be a number';
        } elseif ($data['clean_eating_score'] < 0 || $data['clean_eating_score'] > 1) {
            $errors['clean_eating_score'] = 'Clean eating score must be between 0 and 1';
        }

        // Protein grams validation
        if (!isset($data['protein_grams'])) {
            $errors['protein_grams'] = 'Protein grams is required';
        } elseif (!is_numeric($data['protein_grams']) || $data['protein_grams'] != (int)$data['protein_grams']) {
            $errors['protein_grams'] = 'Protein grams must be an integer';
        } elseif ($data['protein_grams'] < 0 || $data['protein_grams'] > 500) {
            $errors['protein_grams'] = 'Protein grams must be between 0 and 500';
        }

        // Lifted or stretched validation
        if (!isset($data['lifted_or_stretched'])) {
            $errors['lifted_or_stretched'] = 'Lifted or stretched is required';
        } elseif (!is_bool($data['lifted_or_stretched'])) {
            $errors['lifted_or_stretched'] = 'Lifted or stretched must be a boolean';
        }

        // Date validation
        if (!isset($data['date'])) {
            $errors['date'] = 'Date is required';
        } elseif (!$this->isValidDate($data['date'])) {
            $errors['date'] = 'Date must be in YYYY-MM-DD format';
        } elseif (strtotime($data['date']) > time()) {
            $errors['date'] = 'Date cannot be in the future';
        }

        // Protein percentage validation (optional - calculated field)
        if (isset($data['protein_percentage'])) {
            if (!is_numeric($data['protein_percentage'])) {
                $errors['protein_percentage'] = 'Protein percentage must be a number';
            } elseif ($data['protein_percentage'] < 0 || $data['protein_percentage'] > 10) {
                $errors['protein_percentage'] = 'Protein percentage must be between 0 and 10';
            }
        }

        // Composite score validation (optional - calculated field)
        if (isset($data['composite_score'])) {
            if (!is_numeric($data['composite_score'])) {
                $errors['composite_score'] = 'Composite score must be a number';
            } elseif ($data['composite_score'] < 0 || $data['composite_score'] > 1) {
                $errors['composite_score'] = 'Composite score must be between 0 and 1';
            }
        }

        return empty($errors) ? ['valid' => true] : ['valid' => false, 'errors' => $errors];
    }

    private function isValidDate($date) {
        $d = DateTime::createFromFormat('Y-m-d', $date);
        return $d && $d->format('Y-m-d') === $date;
    }
}
