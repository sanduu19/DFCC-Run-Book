package com.ncinga.backend.services;

import com.ncinga.backend.documents.Activities;
import com.ncinga.backend.documents.Records;
import com.ncinga.backend.dtos.ActivityResponse;
import com.ncinga.backend.repos.ActivityRepo;
import com.ncinga.backend.repos.RecordRepo;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
@Data
public class ActivityService {
    private final ActivityRepo activityRepo;
    private final RecordRepo recordRepo;

    public Activities createService(Activities activity){
        activity.setTime(String.valueOf(new Date()));
        Records record = new Records();
        record.setDate(new Date());
        record.setConfirmation(false);
        record.setStatus("Pending");
        Records savedRecord = recordRepo.save(record);
        List<Records> records = activity.getRecords();
        records.add(savedRecord);
        activity.setRecords(records);
        return activityRepo.save(activity);

    }

    public List<ActivityResponse> getAllByDateAndShift(Date date, String shift) {
        SimpleDateFormat dateFormat = new SimpleDateFormat("dd/MM/yyyy  HH:mm");
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
                    if(record.getCompletedTime() != null){
                        response.setCompletedTime(dateFormat.format(record.getCompletedTime()));
                    }
                    if(record.getConfirmTime() != null){
                        response.setConfirmTime(dateFormat.format(record.getConfirmTime()));
                    }
                    response.setDate(record.getDate());
                    response.setComment(record.getComment());
                    return response;
                })).toList();
    }

    public List<AtomicInteger> getPieChartDataByDateAndShift(Date date, String shift) {
        AtomicInteger pending = new AtomicInteger();
        AtomicInteger notApplicable = new AtomicInteger();
        AtomicInteger completed = new AtomicInteger();
        AtomicInteger notConfirmed = new AtomicInteger();
        AtomicInteger confirmed = new AtomicInteger();

        List<Activities> activityListByMorningShift = activityRepo.findByShift(shift).orElseThrow(() -> new RuntimeException("Value not present"));
        activityListByMorningShift
                .forEach(activity -> {
                    activity.getRecords()
                            .forEach(record -> {
                                Calendar calendar = Calendar.getInstance();
                                calendar.setTime(record.getDate());
                                int day = calendar.get(Calendar.DAY_OF_MONTH);
                                int month = calendar.get(Calendar.MONTH) + 1;
                                int year = calendar.get(Calendar.YEAR);

                                calendar.setTime(date);
                                int dayC = calendar.get(Calendar.DAY_OF_MONTH);
                                int monthC = calendar.get(Calendar.MONTH) + 1;
                                int yearC = calendar.get(Calendar.YEAR);

                                if(day == dayC && month == monthC && year == yearC){
                                    if(record.getStatus().equals("Pending")){
                                        pending.getAndIncrement();
                                        notConfirmed.getAndIncrement();
                                    }else{
                                        if(record.getStatus().equals("Completed")){
                                            completed.getAndIncrement();
                                            if(record.isConfirmation()){
                                                confirmed.getAndIncrement();
                                            }else{
                                                notConfirmed.getAndIncrement();
                                            }
                                        }else{
                                            notApplicable.getAndIncrement();
                                            if(record.isConfirmation()){
                                                confirmed.getAndIncrement();
                                            }else{
                                                notConfirmed.getAndIncrement();
                                            }
                                        }
                                    }
                                }
                            });
                });
        return List.of(pending, notApplicable, completed, notConfirmed, confirmed);
    }
}
