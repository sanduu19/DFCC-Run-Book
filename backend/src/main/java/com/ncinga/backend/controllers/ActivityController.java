package com.ncinga.backend.controllers;

import com.ncinga.backend.documents.Activities;
import com.ncinga.backend.documents.Records;
import com.ncinga.backend.dtos.ActivityResponse;
import com.ncinga.backend.services.ActivityService;
import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping(path = "/activities")
@CrossOrigin(origins = "*")
@Data
public class ActivityController {
    private final ActivityService activityService;
    @PostMapping(path="/create")
    public ResponseEntity<Activities> createActivity(@RequestBody Activities activity){
        return ResponseEntity.ok(activityService.createService(activity));
    }

    @GetMapping(path = "/getallbydateandshitf/{date}/{shitf}")
    public ResponseEntity<List<ActivityResponse>> getAllByDateAndShift(@PathVariable Date date, @PathVariable String shitf){
        return ResponseEntity.ok(activityService.getAllByDateAndShift(date, shitf));
    }
}
