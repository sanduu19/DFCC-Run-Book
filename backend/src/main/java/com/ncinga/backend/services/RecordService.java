package com.ncinga.backend.services;

import com.ncinga.backend.documents.Activities;
import com.ncinga.backend.documents.Records;
import com.ncinga.backend.dtos.ActivityRequest;
import com.ncinga.backend.dtos.ActivityResponse;
import com.ncinga.backend.repos.ActivityRepo;
import com.ncinga.backend.repos.RecordRepo;
import lombok.Data;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@Data
public class RecordService {
    private final RecordRepo recordRepo;
    private final ActivityRepo activityRepo;

    public String updateServiceForConfirmation(ActivityRequest activityRequest) {
        Optional<Activities> optionalActivity = activityRepo.findById(activityRequest.getActivityId());
        Optional<Records> optionalRecord = recordRepo.findById(activityRequest.getRecordId());
        if(optionalActivity.isPresent() && optionalRecord.isPresent()){
            Records record = optionalRecord.get();
            if(activityRequest.isConfirmation()){
                record.setConfirmTime(new Date());
                record.setConfirmUser(activityRequest.getConfirmUser());
                record.setConfirmation(true);
            }else{
                record.setConfirmation(false);
            }
            recordRepo.save(record);
            return "Record Saved";
        }
        else{
            return null;
        }
    }

    public String updateServiceForStatus(ActivityRequest activityRequest) {
        Optional<Activities> optionalActivity = activityRepo.findById(activityRequest.getActivityId());
        Optional<Records> optionalRecord = recordRepo.findById(activityRequest.getRecordId());
        if(optionalActivity.isPresent() && optionalRecord.isPresent()){
            Records record = optionalRecord.get();
            if(activityRequest.getStatus() != null && Objects.equals(activityRequest.getStatus(), "Completed") || Objects.equals(activityRequest.getStatus(), "Not Applicable")){
                record.setCompletedTime(new Date());
                record.setUser(activityRequest.getUser());
                record.setStatus(activityRequest.getStatus());
            }else if(activityRequest.getStatus() != null ){
                record.setStatus(activityRequest.getStatus());
            }
            recordRepo.save(record);
            return "Record Saved";
        }
        else{
            return null;
        }
    }

    public String updateServiceForComment(ActivityRequest activityRequest) {
        Optional<Activities> optionalActivity = activityRepo.findById(activityRequest.getActivityId());
        Optional<Records> optionalRecord = recordRepo.findById(activityRequest.getRecordId());
        if(optionalActivity.isPresent() && optionalRecord.isPresent()){
            Records record = optionalRecord.get();
            if(activityRequest.getComment() != null && !activityRequest.getComment().isEmpty()){
                record.setComment(activityRequest.getComment());
            }
            recordRepo.save(record);
            return "Record Saved";
        }
        else{
            return null;
        }
    }

    public String createDailyRecords(Date date) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date startOfDay = calendar.getTime();
        calendar.add(Calendar.DAY_OF_MONTH, 1);
        Date endOfDay = calendar.getTime();

        Optional<List<Records>> fetchedDailyRecords = recordRepo.findByDateBetween(startOfDay, endOfDay);
        if(fetchedDailyRecords.isPresent() && fetchedDailyRecords.get().size() == activityRepo.findAll().size()){
            return "Daily Records has been Created";
        } else{
            activityRepo.findAll().forEach(activity -> {
                Records record = new Records();
                record.setDate(date);
                record.setConfirmation(false);
                record.setStatus("Pending");
                Records savedRecord = recordRepo.save(record);
                List<Records> records = activity.getRecords();
                records.add(savedRecord);
                activity.setRecords(records);
                activityRepo.save(activity);
            });
            return "Daily Records Created";
        }
    }
}