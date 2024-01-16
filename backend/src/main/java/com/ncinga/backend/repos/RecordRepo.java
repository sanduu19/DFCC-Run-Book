package com.ncinga.backend.repos;

import com.ncinga.backend.documents.Records;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface RecordRepo extends MongoRepository<Records,String> {
     Optional<List<Records>> findByDateBetween(Date start, Date end);
}
