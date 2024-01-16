package com.ncinga.backend.controllers;

import com.ncinga.backend.documents.Records;
import com.ncinga.backend.dtos.ActivityResponse;
import com.ncinga.backend.services.RecordService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.Optional;

@RestController
@RequestMapping(path="/records")
@CrossOrigin(origins = "*")
@Data
public class RecordController {
    private final RecordService recordService;

    @GetMapping(path = "/create/daily/{date}")
    public ResponseEntity<String> createDailyRecords(@PathVariable Date date){
        return ResponseEntity.ok(recordService.createDailyRecords(date));
    }

    @PostMapping(path="/update/confirmation")
    public ResponseEntity<String> updateRecordConfirmation(@RequestBody ActivityResponse activityResponse){
        return ResponseEntity.ok(recordService.updateServiceForConfirmation(activityResponse));
    }

    @PostMapping(path="/update/status")
    public ResponseEntity<String> updateRecordStatus(@RequestBody ActivityResponse activityResponse){
        return ResponseEntity.ok(recordService.updateServiceForStatus(activityResponse));
    }

    @PostMapping(path="/update/comment")
    public ResponseEntity<String> updateRecordComment(@RequestBody ActivityResponse activityResponse){
        return ResponseEntity.ok(recordService.updateServiceForComment(activityResponse));
    }
}
