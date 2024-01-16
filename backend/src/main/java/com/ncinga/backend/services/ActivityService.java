package com.ncinga.backend.services;

import com.ncinga.backend.documents.Activities;
import com.ncinga.backend.documents.Records;
import com.ncinga.backend.dtos.ActivityResponse;
import com.ncinga.backend.repos.ActivityRepo;
import lombok.Data;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Data
public class ActivityService {
    private final ActivityRepo activityRepo;

    public Activities createService(Activities activity){
        activity.setTime(String.valueOf(new Date()));
        return activityRepo.save(activity);

    }

    public List<ActivityResponse> getAllByDateAndShift(Date date, String shift) {
        List<Activities> activityListByShift = activityRepo.findByShift(shift).orElseThrow(() -> new RuntimeException("Value not present"));
        List<Activities> activityListByShiftAndDate = activityListByShift.stream()
                .peek(activity -> {
                    List<Records> filteredRecords = activity.getRecords().stream()
                            .filter(record -> {
                                Calendar calendar = Calendar.getInstance();
                                calendar.setTime(record.getDate());
                                int day = calendar.get(Calendar.DAY_OF_MONTH);
                                int month = calendar.get(Calendar.MONTH) + 1;
                                int year = calendar.get(Calendar.YEAR);

                                calendar.setTime(date);
                                int dayC = calendar.get(Calendar.DAY_OF_MONTH);
                                int monthC = calendar.get(Calendar.MONTH) + 1;
                                int yearC = calendar.get(Calendar.YEAR);
                                return day == dayC && month == monthC && year == yearC;
                            })
                            .collect(Collectors.toList());
                    activity.setRecords(filteredRecords); // Assuming Activities has a setter for Records
                }).toList();

        return activityListByShiftAndDate.stream().flatMap(activity ->
                activity.getRecords().stream().map(record -> {
                    ActivityResponse response = new ActivityResponse();
                    response.setActivityId(activity.getId());
                    response.setName(activity.getName());
                    response.setTime(activity.getTime());
                    response.setDescription(activity.getDescription());
                    response.setShift(activity.getShift());
                    response.setRecordId(record.getId());
                    response.setUser(record.getUser());
                    response.setConfirmUser(record.getConfirmUser());
                    response.setConfirmation(record.isConfirmation());
                    response.setStatus(record.getStatus());
                    response.setCompletedTime(record.getCompletedTime());
                    response.setConfirmTime(record.getConfirmTime());
                    response.setDate(record.getDate());
                    response.setComment(record.getComment());
                    return response;
                })).toList();
    }
}
