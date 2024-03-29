package com.ncinga.backend.dtos;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class ActivityResponse {
    private String activityId;
    private String name;
    private String time;
    private String shift; //Morning,Mid,Night
    private String description;
    private String recordId;
    private String user;
    private String confirmUser;
    private boolean confirmation;
    private String status; //complete|not complete|pending
    private Date confirmTime;
    private Date completedTime;
    private Date date;
    private String comment;
}
