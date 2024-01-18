package com.ncinga.backend.controllers;

import com.ncinga.backend.dtos.ActivityRequest;
import com.ncinga.backend.services.RecordService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

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
    public ResponseEntity<String> updateRecordConfirmation(@RequestBody ActivityRequest activityRequest){
        return ResponseEntity.ok(recordService.updateServiceForConfirmation(activityRequest));
    }

    @PostMapping(path="/update/status")
    public ResponseEntity<String> updateRecordStatus(@RequestBody ActivityRequest activityRequest){
        return ResponseEntity.ok(recordService.updateServiceForStatus(activityRequest));
    }

    @PostMapping(path="/update/comment")
    public ResponseEntity<String> updateRecordComment(@RequestBody ActivityRequest activityRequest){
        return ResponseEntity.ok(recordService.updateServiceForComment(activityRequest));
    }
}
