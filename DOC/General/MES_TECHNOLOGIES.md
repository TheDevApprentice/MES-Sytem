# Technologies MES : écosystème technique

## Table des matières
1. Empilement technologique moderne
2. Protocoles de communication industrielle
3. Intégration avec l’entreprise
4. Connectivité IoT et edge
5. APIs et web services
6. Bases de données et stockage
7. Technologies émergentes
8. Bonnes pratiques d’implémentation

## Écosystème Technologique

### Stack Technologique MES Moderne

```
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                       │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   Web UI    │ │ Mobile Apps │ │    Desktop Apps     │   │
│  │ (React/Vue) │ │(React Native│ │      (JavaFX)       │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ HTTP/WebSocket
┌─────────────────────▼───────────────────────────────────────┐
│                  API Gateway                                │
│            (Spring Cloud Gateway)                          │
└─────────────────────┬───────────────────────────────────────┘
                      │ REST/GraphQL
┌─────────────────────▼───────────────────────────────────────┐
│               Microservices Layer                           │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │ Production  │ │   Quality   │ │    Equipment        │   │
│  │  Service    │ │   Service   │ │     Service         │   │
│  │(Spring Boot)│ │(Spring Boot)│ │   (Spring Boot)     │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │ Message Bus (Kafka)
┌─────────────────────▼───────────────────────────────────────┐
│              Integration Layer                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────────────┐   │
│  │   OPC UA    │ │    MQTT     │ │       REST API      │   │
│  │ Connector   │ │  Connector  │ │     Connector       │   │
│  └─────────────┘ └─────────────┘ └─────────────────────┘   │
└─────────────────────┬───────────────────────────────────────┘
                      │
┌─────────────────────▼───────────────────────────────────────┐
│                Field Devices                                │
│     PLCs, SCADA, Sensors, HMI, Robots, etc.              │
└─────────────────────────────────────────────────────────────┘
```

### Choix Technologiques par Composant

#### Backend Services
```java
// Configuration Spring Boot pour MES
@SpringBootApplication
@EnableEurekaClient
@EnableZipkinServer
@EnableConfigServer
public class MESApplication {
    
    public static void main(String[] args) {
        SpringApplication.run(MESApplication.class, args);
    }
    
    @Bean
    @LoadBalanced
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
    
    @Bean
    public KafkaTemplate<String, Object> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}

// Configuration JPA optimisée pour données industrielles
@Configuration
@EnableJpaRepositories
@EnableTransactionManagement
public class DatabaseConfiguration {
    
    @Primary
    @Bean
    public DataSource primaryDataSource() {
        HikariConfig config = new HikariConfig();
        config.setJdbcUrl("jdbc:postgresql://localhost:5432/mes_production");
        config.setMaximumPoolSize(50);
        config.setMinimumIdle(10);
        config.setConnectionTimeout(30000);
        config.setIdleTimeout(600000);
        config.setMaxLifetime(1800000);
        
        // Optimisations pour workload industriel
        config.addDataSourceProperty("cachePrepStmts", "true");
        config.addDataSourceProperty("prepStmtCacheSize", "250");
        config.addDataSourceProperty("prepStmtCacheSqlLimit", "2048");
        
        return new HikariDataSource(config);
    }
    
    @Bean
    public DataSource timeSeriesDataSource() {
        // Source dédiée pour données temporelles
        return DataSourceBuilder.create()
            .driverClassName("org.postgresql.Driver")
            .url("jdbc:postgresql://timescale-db:5432/mes_timeseries")
            .build();
    }
}
```

## Protocoles de Communication Industrielle

### OPC UA (Open Platform Communications Unified Architecture)

#### Caractéristiques et Avantages
- **Interopérabilité** : Standard universel industrie
- **Sécurité** : Chiffrement, authentification, autorisation
- **Sémantique** : Modèles d'information riches
- **Scalabilité** : Du capteur au cloud

#### Implémentation Java avec Eclipse Milo
```java
@Component
public class OpcUaClientService {
    
    private OpcUaClient client;
    private final String endpointUrl = "opc.tcp://plc-server:4840";
    
    @PostConstruct
    public void initializeClient() throws Exception {
        // Configuration sécurisée du client OPC UA
        KeyPair keyPair = CertificateGenerator.generateRsaKeyPair(2048);
        X509Certificate certificate = CertificateGenerator.generateSelfSigned(
            keyPair,
            "CN=MES-Client, O=Manufacturing Corp, L=City, C=US",
            Duration.ofDays(365)
        );
        
        SecurityPolicy securityPolicy = SecurityPolicy.Basic256Sha256;
        MessageSecurityMode messageSecurity = MessageSecurityMode.SignAndEncrypt;
        
        EndpointDescription endpoint = Arrays.stream(
            DiscoveryClient.getEndpoints(endpointUrl).get())
            .filter(e -> e.getSecurityPolicyUri().equals(securityPolicy.getUri()))
            .filter(e -> e.getSecurityMode() == messageSecurity)
            .findFirst()
            .orElseThrow(() -> new RuntimeException("No suitable endpoint found"));
            
        OpcUaClientConfig config = OpcUaClientConfig.builder()
            .setApplicationName(LocalizedText.english("MES OPC UA Client"))
            .setApplicationUri("urn:mes:client")
            .setCertificate(certificate)
            .setKeyPair(keyPair)
            .setEndpoint(endpoint)
            .setRequestTimeout(uint(60000))
            .build();
            
        client = OpcUaClient.create(config);
        client.connect().get();
        
        // Création de subscription pour monitoring temps réel
        createSubscription();
    }
    
    private void createSubscription() throws Exception {
        UaSubscription subscription = client.getSubscriptionManager()
            .createSubscription(1000.0) // 1 seconde
            .get();
            
        // Nodes à surveiller
        List<String> nodeIds = Arrays.asList(
            "ns=2;s=Production.Line1.Speed",
            "ns=2;s=Production.Line1.Temperature", 
            "ns=2;s=Production.Line1.Pressure",
            "ns=2;s=Production.Line1.Status"
        );
        
        List<ReadValueId> readValueIds = nodeIds.stream()
            .map(nodeId -> new ReadValueId(
                new NodeId(2, nodeId),
                AttributeId.Value.uid(),
                null,
                QualifiedName.NULL_VALUE))
            .collect(Collectors.toList());
            
        BiFunction<UaMonitoredItem, Integer, UaMonitoredItem> onItemCreated =
            (item, id) -> item.setValueConsumer(this::onValueChanged);
            
        List<UaMonitoredItem> items = subscription.createMonitoredItems(
            TimestampsToReturn.Both,
            readValueIds.stream()
                .map(readValueId -> new MonitoringParameters(
                    uint(1), // client handle
                    1000.0,  // sampling interval
                    null,    // filter
                    uint(10), // queue size
                    true))   // discard oldest
                .collect(Collectors.toList()),
            onItemCreated
        ).get();
    }
    
    private void onValueChanged(UaMonitoredItem item, DataValue value) {
        // Traitement des changements de valeur en temps réel
        String nodeId = item.getReadValueId().getNodeId().getIdentifier().toString();
        Object variableValue = value.getValue().getValue();
        DateTime timestamp = value.getServerTime();
        
        // Publication vers message bus pour traitement asynchrone
        ProcessDataEvent event = ProcessDataEvent.builder()
            .equipmentId(extractEquipmentId(nodeId))
            .parameterName(extractParameterName(nodeId))
            .value(variableValue)
            .timestamp(timestamp.getJavaDate().toInstant())
            .quality(mapQualityCode(value.getStatusCode()))
            .build();
            
        eventPublisher.publishEvent(event);
        
        // Stockage en base de données temporelles
        timeSeriesService.storeDataPoint(event);
    }
    
    public CompletableFuture<Void> writeValue(String nodeId, Object value) {
        NodeId node = new NodeId(2, nodeId);
        Variant variant = new Variant(value);
        DataValue dataValue = new DataValue(variant, null, null);
        
        WriteValue writeValue = new WriteValue(
            node,
            AttributeId.Value.uid(),
            null,
            dataValue
        );
        
        return client.write(List.of(writeValue))
            .thenAccept(statusCodes -> {
                if (statusCodes.get(0).isBad()) {
                    throw new RuntimeException("Failed to write value: " + statusCodes.get(0));
                }
            });
    }
}
```

### MQTT (Message Queuing Telemetry Transport)

#### Architecture MQTT pour IoT Industriel
```java
@Configuration
@EnableMqtt
public class MqttConfiguration {
    
    @Bean
    public MqttPahoClientFactory mqttClientFactory() {
        DefaultMqttPahoClientFactory factory = new DefaultMqttPahoClientFactory();
        
        MqttConnectOptions options = new MqttConnectOptions();
        options.setServerURIs(new String[] {"tcp://mqtt-broker:1883"});
        options.setUserName("mes-system");
        options.setPassword("secure-password".toCharArray());
        options.setCleanSession(true);
        options.setAutomaticReconnect(true);
        options.setKeepAliveInterval(30);
        options.setConnectionTimeout(10);
        
        // Configuration SSL/TLS pour production
        if (isProductionEnvironment()) {
            try {
                SSLContext sslContext = SSLContext.getInstance("TLSv1.2");
                sslContext.init(null, null, null);
                options.setSocketFactory(sslContext.getSocketFactory());
            } catch (Exception e) {
                throw new RuntimeException("Failed to configure SSL", e);
            }
        }
        
        factory.setConnectionOptions(options);
        return factory;
    }
    
    @Bean
    @ServiceActivator(inputChannel = "mqttOutboundChannel")
    public MessageHandler mqttOutbound() {
        MqttPahoMessageHandler messageHandler = new MqttPahoMessageHandler(
            "mes-publisher", 
            mqttClientFactory()
        );
        messageHandler.setAsync(true);
        messageHandler.setDefaultTopic("mes/production/data");
        messageHandler.setDefaultQos(1); // At least once delivery
        return messageHandler;
    }
    
    @Bean
    public MessageProducer inbound() {
        MqttPahoMessageDrivenChannelAdapter adapter = 
            new MqttPahoMessageDrivenChannelAdapter(
                "mes-subscriber", 
                mqttClientFactory(),
                "sensor/+/data", // Wildcard subscription
                "equipment/+/status",
                "alarm/+/+");
                
        adapter.setCompletionTimeout(5000);
        adapter.setConverter(new DefaultPahoMessageConverter());
        adapter.setQos(1);
        adapter.setOutputChannel(mqttInputChannel());
        return adapter;
    }
    
    @Bean
    public MessageChannel mqttInputChannel() {
        return new DirectChannel();
    }
}

@Component
public class MqttMessageProcessor {
    
    @ServiceActivator(inputChannel = "mqttInputChannel")
    public void processMessage(Message<String> message) {
        String topic = (String) message.getHeaders().get(MqttHeaders.RECEIVED_TOPIC);
        String payload = message.getPayload();
        
        try {
            if (topic.startsWith("sensor/")) {
                processSensorData(topic, payload);
            } else if (topic.startsWith("equipment/")) {
                processEquipmentStatus(topic, payload);
            } else if (topic.startsWith("alarm/")) {
                processAlarm(topic, payload);
            }
        } catch (Exception e) {
            logger.error("Error processing MQTT message from topic {}: {}", topic, e.getMessage());
            // Dead letter queue pour messages en erreur
            deadLetterService.sendToDeadLetter(topic, payload, e);
        }
    }
    
    private void processSensorData(String topic, String payload) {
        // Parse topic: sensor/{sensorId}/data
        String sensorId = extractSensorId(topic);
        
        SensorReading reading = objectMapper.readValue(payload, SensorReading.class);
        reading.setSensorId(sensorId);
        reading.setReceivedAt(Instant.now());
        
        // Validation des données
        if (!isValidReading(reading)) {
            logger.warn("Invalid sensor reading from {}: {}", sensorId, reading);
            return;
        }
        
        // Stockage time-series
        timeSeriesRepository.save(reading);
        
        // Détection d'anomalies en temps réel
        if (anomalyDetectionService.isAnomalous(reading)) {
            alertService.sendAnomalyAlert(reading);
        }
        
        // Publication pour traitement downstream
        eventPublisher.publishEvent(new SensorDataReceivedEvent(reading));
    }
}
```

### Modbus TCP/RTU

#### Connecteur Modbus industriel
```java
@Component
public class ModbusConnector {
    
    private ModbusMaster master;
    private final Map<String, ModbusDevice> devices = new ConcurrentHashMap<>();
    
    @PostConstruct
    public void initialize() {
        // Configuration Modbus TCP
        IpParameters params = new IpParameters();
        params.setHost("192.168.1.100");
        params.setPort(502);
        
        master = new ModbusMasterTcp(params);
        master.connect();
        
        // Enregistrement des devices
        registerDevices();
        
        // Polling périodique
        startPolling();
    }
    
    private void registerDevices() {
        // PLC principal
        devices.put("PLC-001", ModbusDevice.builder()
            .slaveId(1)
            .startAddress(0)
            .quantity(50)
            .registerType(RegisterType.HOLDING_REGISTER)
            .pollingInterval(1000)
            .build());
            
        // Module I/O distant
        devices.put("IO-MODULE-001", ModbusDevice.builder()
            .slaveId(2)
            .startAddress(0)
            .quantity(16)
            .registerType(RegisterType.INPUT_REGISTER)
            .pollingInterval(500)
            .build());
    }
    
    @Scheduled(fixedDelay = 1000)
    public void pollDevices() {
        devices.entrySet().parallelStream().forEach(entry -> {
            String deviceId = entry.getKey();
            ModbusDevice device = entry.getValue();
            
            try {
                if (shouldPoll(device)) {
                    ModbusData data = readDevice(device);
                    processData(deviceId, data);
                }
            } catch (Exception e) {
                logger.error("Error polling device {}: {}", deviceId, e.getMessage());
                handleDeviceError(deviceId, e);
            }
        });
    }
    
    private ModbusData readDevice(ModbusDevice device) throws Exception {
        Response response;
        
        switch (device.getRegisterType()) {
            case HOLDING_REGISTER:
                response = master.readHoldingRegisters(
                    device.getSlaveId(),
                    device.getStartAddress(),
                    device.getQuantity()
                );
                break;
            case INPUT_REGISTER:
                response = master.readInputRegisters(
                    device.getSlaveId(),
                    device.getStartAddress(),
                    device.getQuantity()
                );
                break;
            case COIL:
                response = master.readCoils(
                    device.getSlaveId(),
                    device.getStartAddress(),
                    device.getQuantity()
                );
                break;
            default:
                throw new UnsupportedOperationException("Register type not supported: " + device.getRegisterType());
        }
        
        if (!response.isSuccess()) {
            throw new ModbusException("Modbus read failed: " + response.getExceptionMessage());
        }
        
        return ModbusData.from(response, device);
    }
    
    public void writeRegister(String deviceId, int address, int value) throws Exception {
        ModbusDevice device = devices.get(deviceId);
        if (device == null) {
            throw new IllegalArgumentException("Device not found: " + deviceId);
        }
        
        Response response = master.writeSingleRegister(
            device.getSlaveId(),
            address,
            value
        );
        
        if (!response.isSuccess()) {
            throw new ModbusException("Modbus write failed: " + response.getExceptionMessage());
        }
    }
}
```

## Intégration ERP et Systèmes d'Entreprise

### Connecteur SAP

#### Integration avec SAP PP (Production Planning)
```java
@Service
public class SapIntegrationService {
    
    private final SapJCoDestination destination;
    private final OrderMappingService orderMappingService;
    
    @Autowired
    public SapIntegrationService(SapJCoConfiguration config) {
        try {
            this.destination = JCoDestinationManager.getDestination("SAP_SYSTEM");
        } catch (JCoException e) {
            throw new RuntimeException("Failed to connect to SAP system", e);
        }
    }
    
    @Scheduled(fixedDelay = 300000) // 5 minutes
    public void syncProductionOrders() {
        try {
            List<SapProductionOrder> sapOrders = fetchProductionOrdersFromSap();
            
            for (SapProductionOrder sapOrder : sapOrders) {
                if (sapOrder.isReleased() && !isAlreadyProcessed(sapOrder.getOrderNumber())) {
                    ProductionOrder mesOrder = orderMappingService.mapFromSap(sapOrder);
                    productionOrderService.createOrder(mesOrder);
                    
                    logger.info("Created MES order {} from SAP order {}", 
                        mesOrder.getOrderId(), sapOrder.getOrderNumber());
                }
            }
        } catch (Exception e) {
            logger.error("Error syncing production orders from SAP", e);
            alertService.sendIntegrationAlert("SAP_SYNC_ERROR", e.getMessage());
        }
    }
    
    private List<SapProductionOrder> fetchProductionOrdersFromSap() throws JCoException {
        JCoFunction function = destination.getRepository().getFunction("BAPI_PRODORD_GET_LIST");
        
        if (function == null) {
            throw new RuntimeException("BAPI_PRODORD_GET_LIST not found in SAP system");
        }
        
        // Paramètres de sélection
        JCoParameterList input = function.getImportParameterList();
        input.setValue("ORDER_STATUS", "REL"); // Released orders only
        input.setValue("SELECTION_DATE", LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
        
        function.execute(destination);
        
        // Traitement de la réponse
        JCoTable orderTable = function.getTableParameterList().getTable("ORDER_OBJECTS");
        List<SapProductionOrder> orders = new ArrayList<>();
        
        for (int i = 0; i < orderTable.getNumRows(); i++) {
            orderTable.setRow(i);
            
            SapProductionOrder order = SapProductionOrder.builder()
                .orderNumber(orderTable.getString("AUFNR"))
                .materialNumber(orderTable.getString("MATNR"))
                .plannedQuantity(orderTable.getBigDecimal("GAMNG"))
                .unitOfMeasure(orderTable.getString("GMEIN"))
                .basicStartDate(parseDate(orderTable.getString("GSTRP")))
                .basicFinishDate(parseDate(orderTable.getString("GLTRP")))
                .plant(orderTable.getString("WERKS"))
                .workCenter(orderTable.getString("ARBPL"))
                .build();
                
            orders.add(order);
        }
        
        return orders;
    }
    
    public void sendProductionConfirmation(ProductionConfirmation confirmation) {
        try {
            JCoFunction function = destination.getRepository().getFunction("BAPI_PRODORDCONF_CREATE_HDR");
            
            // En-tête de confirmation
            JCoStructure header = function.getImportParameterList().getStructure("TIMETICKET");
            header.setValue("ORDERID", confirmation.getSapOrderNumber());
            header.setValue("OPERATION", confirmation.getOperationNumber());
            header.setValue("WORK_CNTR", confirmation.getWorkCenter());
            header.setValue("PLANT", confirmation.getPlant());
            header.setValue("EXEC_START_DATE", formatDate(confirmation.getActualStartDate()));
            header.setValue("EXEC_START_TIME", formatTime(confirmation.getActualStartTime()));
            header.setValue("EXEC_FINISH_DATE", formatDate(confirmation.getActualFinishDate()));
            header.setValue("EXEC_FINISH_TIME", formatTime(confirmation.getActualFinishTime()));
            header.setValue("CONF_ACTIVITY", confirmation.getConfirmedActivity());
            header.setValue("CONF_TEXT", confirmation.getComments());
            
            // Quantités confirmées
            JCoTable quantityTable = function.getTableParameterList().getTable("TIMETICKET_GOODSMVT");
            if (quantityTable != null) {
                quantityTable.appendRow();
                quantityTable.setValue("MATERIAL", confirmation.getMaterialNumber());
                quantityTable.setValue("CONF_QUANTITY", confirmation.getConfirmedQuantity());
                quantityTable.setValue("UNIT", confirmation.getUnitOfMeasure());
                quantityTable.setValue("MOVEMENT_TYPE", "101"); // Goods receipt
            }
            
            function.execute(destination);
            
            // Vérification des erreurs
            JCoTable returnTable = function.getTableParameterList().getTable("RETURN");
            checkSapErrors(returnTable);
            
            // Commit de la transaction
            commitSapTransaction();
            
            logger.info("Production confirmation sent to SAP for order {}", 
                confirmation.getSapOrderNumber());
                
        } catch (Exception e) {
            logger.error("Error sending production confirmation to SAP", e);
            throw new IntegrationException("Failed to send confirmation to SAP", e);
        }
    }
}
```

### Connecteur Oracle EBS

#### Integration Manufacturing avec Oracle EBS
```java
@Service
public class OracleEbsConnector {
    
    @Autowired
    private JdbcTemplate oracleJdbcTemplate;
    
    @Autowired
    private RestTemplate restTemplate;
    
    // Sync via database direct access
    @Transactional(readOnly = true)
    public List<WorkOrder> fetchWorkOrdersFromOracle() {
        String sql = """
            SELECT 
                wdj.wip_entity_id,
                wdj.wip_entity_name,
                wdj.primary_item_id,
                msi.segment1 as item_number,
                wdj.start_quantity,
                wdj.quantity_completed,
                wdj.date_released,
                wdj.scheduled_start_date,
                wdj.scheduled_completion_date,
                wdj.status_type,
                wdj.organization_id,
                ood.organization_code
            FROM wip_discrete_jobs wdj
            JOIN mtl_system_items_b msi ON wdj.primary_item_id = msi.inventory_item_id
            JOIN org_organization_definitions ood ON wdj.organization_id = ood.organization_id
            WHERE wdj.status_type = 3  -- Released
              AND wdj.date_released >= SYSDATE - 7
            ORDER BY wdj.scheduled_start_date
            """;
            
        return oracleJdbcTemplate.query(sql, (rs, rowNum) -> 
            WorkOrder.builder()
                .wipEntityId(rs.getLong("wip_entity_id"))
                .wipEntityName(rs.getString("wip_entity_name"))
                .itemId(rs.getLong("primary_item_id"))
                .itemNumber(rs.getString("item_number"))
                .startQuantity(rs.getBigDecimal("start_quantity"))
                .quantityCompleted(rs.getBigDecimal("quantity_completed"))
                .dateReleased(rs.getTimestamp("date_released").toLocalDateTime())
                .scheduledStartDate(rs.getTimestamp("scheduled_start_date").toLocalDateTime())
                .scheduledCompletionDate(rs.getTimestamp("scheduled_completion_date").toLocalDateTime())
                .statusType(rs.getInt("status_type"))
                .organizationId(rs.getLong("organization_id"))
                .organizationCode(rs.getString("organization_code"))
                .build()
        );
    }
    
    // Sync via REST API
    public void sendProductionTransaction(ProductionTransaction transaction) {
        String url = oracleEbsBaseUrl + "/fscmRestApi/resources/11.13.18.05/manufacturingWorkOrders";
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(getOracleAccessToken());
        
        OracleTransactionRequest request = OracleTransactionRequest.builder()
            .wipEntityName(transaction.getWorkOrderNumber())
            .operationSeqNum(transaction.getOperationSequence())
            .transactionType("WIP_COMPLETION")
            .transactionDate(transaction.getTransactionDate().format(DateTimeFormatter.ISO_LOCAL_DATE_TIME))
            .primaryQuantity(transaction.getQuantity())
            .transactionUom(transaction.getUnitOfMeasure())
            .reasonCode(transaction.getReasonCode())
            .reference(transaction.getReference())
            .build();
            
        HttpEntity<OracleTransactionRequest> entity = new HttpEntity<>(request, headers);
        
        try {
            ResponseEntity<OracleTransactionResponse> response = restTemplate.postForEntity(
                url, entity, OracleTransactionResponse.class);
                
            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Production transaction sent successfully to Oracle EBS: {}", 
                    response.getBody().getTransactionId());
            } else {
                throw new IntegrationException("Oracle EBS returned error: " + response.getBody());
            }
        } catch (Exception e) {
            logger.error("Error sending production transaction to Oracle EBS", e);
            throw new IntegrationException("Failed to send transaction to Oracle EBS", e);
        }
    }
    
    private String getOracleAccessToken() {
        // Implémentation OAuth2 pour Oracle EBS
        return oracleAuthService.getAccessToken();
    }
}
```

## Connectivité IoT et Edge Computing

### Edge Computing Architecture

#### Edge Gateway Configuration
```java
@Configuration
@EnableEdgeComputing
public class EdgeGatewayConfiguration {
    
    @Bean
    public EdgeDevice createEdgeDevice() {
        return EdgeDevice.builder()
            .deviceId("EDGE-GATEWAY-001")
            .location("Production Floor 1")
            .capabilities(Arrays.asList(
                EdgeCapability.DATA_COLLECTION,
                EdgeCapability.LOCAL_ANALYTICS,
                EdgeCapability.PROTOCOL_CONVERSION,
                EdgeCapability.OFFLINE_BUFFER
            ))
            .maxBufferSize(10000)
            .syncInterval(Duration.ofSeconds(30))
            .build();
    }
    
    @Bean
    public EdgeDataProcessor edgeDataProcessor() {
        return new EdgeDataProcessor() {
            
            @Override
            public ProcessedData process(RawData rawData) {
                // Traitement local des données
                ProcessedData processed = new ProcessedData();
                processed.setDeviceId(rawData.getDeviceId());
                processed.setTimestamp(rawData.getTimestamp());
                
                // Filtrage des données (réduction du volume)
                if (isSignificantChange(rawData)) {
                    processed.setValue(rawData.getValue());
                    processed.setQuality(QualityCode.GOOD);
                } else {
                    // Données filtrées - pas de transmission vers cloud
                    return null;
                }
                
                // Analytics locales
                AnomalyScore score = localAnalyticsEngine.analyzeAnomaly(rawData);
                if (score.isAnomalous()) {
                    processed.addFlag(DataFlag.ANOMALY_DETECTED);
                    processed.setAnomalyScore(score.getScore());
                }
                
                return processed;
            }
        };
    }
    
    @Bean
    public EdgeOfflineBuffer offlineBuffer() {
        return new EdgeOfflineBuffer() {
            
            private final Queue<ProcessedData> buffer = new ConcurrentLinkedQueue<>();
            private final AtomicInteger bufferSize = new AtomicInteger(0);
            
            @Override
            public void buffer(ProcessedData data) {
                if (bufferSize.get() < maxBufferSize) {
                    buffer.offer(data);
                    bufferSize.incrementAndGet();
                } else {
                    // FIFO - supprime le plus ancien
                    buffer.poll();
                    buffer.offer(data);
                }
            }
            
            @Override
            public List<ProcessedData> drain() {
                List<ProcessedData> data = new ArrayList<>(buffer);
                buffer.clear();
                bufferSize.set(0);
                return data;
            }
        };
    }
}
```

### Collecte de Données IoT

#### Gestion de Capteurs Distribués
```java
@Component
public class IoTSensorManager {
    
    private final Map<String, SensorDevice> sensors = new ConcurrentHashMap<>();
    private final ScheduledExecutorService executor = Executors.newScheduledThreadPool(10);
    
    @PostConstruct
    public void initializeSensors() {
        // Auto-découverte des capteurs via mDNS/Bonjour
        discoverSensors();
        
        // Configuration des capteurs connus
        configureSensors();
        
        // Démarrage de la collecte
        startDataCollection();
    }
    
    private void discoverSensors() {
        // Découverte automatique via protocoles réseau
        ServiceDiscovery discovery = new ServiceDiscovery();
        
        discovery.discover("_iot-sensor._tcp.local.", (service) -> {
            SensorDevice sensor = SensorDevice.builder()
                .sensorId(service.getName())
                .ipAddress(service.getInetAddress().getHostAddress())
                .port(service.getPort())
                .protocol(extractProtocol(service.getTextRecord()))
                .sensorType(extractSensorType(service.getTextRecord()))
                .build();
                
            sensors.put(sensor.getSensorId(), sensor);
            logger.info("Discovered sensor: {}", sensor);
        });
    }
    
    private void startDataCollection() {
        sensors.values().forEach(sensor -> {
            // Planification de la collecte selon la fréquence du capteur
            ScheduledFuture<?> task = executor.scheduleAtFixedRate(
                () -> collectSensorData(sensor),
                0,
                sensor.getSamplingInterval(),
                TimeUnit.MILLISECONDS
            );
            
            sensor.setCollectionTask(task);
        });
    }
    
    private void collectSensorData(SensorDevice sensor) {
        try {
            SensorReading reading = null;
            
            switch (sensor.getProtocol()) {
                case HTTP:
                    reading = collectViaHttp(sensor);
                    break;
                case COAP:
                    reading = collectViaCoap(sensor);
                    break;
                case MQTT:
                    // MQTT est push - pas de collection active
                    return;
                case MODBUS_TCP:
                    reading = collectViaModbus(sensor);
                    break;
                default:
                    logger.warn("Unsupported protocol for sensor {}: {}", 
                        sensor.getSensorId(), sensor.getProtocol());
                    return;
            }
            
            if (reading != null) {
                processSensorReading(reading);
            }
            
        } catch (Exception e) {
            logger.error("Error collecting data from sensor {}: {}", 
                sensor.getSensorId(), e.getMessage());
            handleSensorError(sensor, e);
        }
    }
    
    private SensorReading collectViaHttp(SensorDevice sensor) {
        String url = String.format("http://%s:%d/api/readings", 
            sensor.getIpAddress(), sensor.getPort());
            
        RestTemplate restTemplate = new RestTemplate();
        
        try {
            ResponseEntity<SensorReading> response = restTemplate.getForEntity(
                url, SensorReading.class);
                
            if (response.getStatusCode().is2xxSuccessful()) {
                SensorReading reading = response.getBody();
                reading.setSensorId(sensor.getSensorId());
                reading.setCollectionTime(Instant.now());
                return reading;
            }
        } catch (Exception e) {
            throw new SensorCommunicationException("HTTP collection failed", e);
        }
        
        return null;
    }
    
    private SensorReading collectViaCoap(SensorDevice sensor) {
        // Implémentation CoAP client
        CoapClient client = new CoapClient(
            String.format("coap://%s:%d/sensor/data", sensor.getIpAddress(), sensor.getPort())
        );
        
        try {
            CoapResponse response = client.get();
            
            if (response != null && response.isSuccess()) {
                String payload = response.getResponseText();
                SensorReading reading = objectMapper.readValue(payload, SensorReading.class);
                reading.setSensorId(sensor.getSensorId());
                reading.setCollectionTime(Instant.now());
                return reading;
            }
        } catch (Exception e) {
            throw new SensorCommunicationException("CoAP collection failed", e);
        } finally {
            client.shutdown();
        }
        
        return null;
    }
    
    private void processSensorReading(SensorReading reading) {
        // Validation des données
        if (!isValidReading(reading)) {
            logger.warn("Invalid sensor reading: {}", reading);
            return;
        }
        
        // Stockage local
        sensorDataRepository.save(reading);
        
        // Traitement edge si nécessaire
        ProcessedData processed = edgeDataProcessor.process(reading);
        if (processed != null) {
            // Transmission vers cloud/serveur central
            cloudGateway.send(processed);
        }
        
        // Détection d'alarmes en temps réel
        alarmEngine.evaluate(reading);
        
        // Publication événement pour subscribers
        eventPublisher.publishEvent(new SensorDataReceivedEvent(reading));
    }
}
```

## APIs et Services Web

### API REST Design

#### Controllers avec standards REST
```java
@RestController
@RequestMapping("/api/v1/production")
@Validated
@SecurityRequirement(name = "bearerAuth")
public class ProductionOrderController {
    
    @Autowired
    private ProductionOrderService productionOrderService;
    
    @GetMapping
    @Operation(summary = "Get production orders", description = "Retrieve production orders with filtering and pagination")
    public ResponseEntity<PagedResponse<ProductionOrderDto>> getProductionOrders(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String workCenter,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        
        ProductionOrderFilter filter = ProductionOrderFilter.builder()
            .status(status)
            .workCenter(workCenter)
            .startDate(startDate)
            .endDate(endDate)
            .build();
            
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        
        Page<ProductionOrder> orders = productionOrderService.findOrders(filter, pageable);
        
        PagedResponse<ProductionOrderDto> response = PagedResponse.<ProductionOrderDto>builder()
            .content(orders.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList()))
            .page(orders.getNumber())
            .size(orders.getSize())
            .totalElements(orders.getTotalElements())
            .totalPages(orders.getTotalPages())
            .build();
            
        return ResponseEntity.ok(response);
    }
    
    @PostMapping
    @Operation(summary = "Create production order")
    public ResponseEntity<ProductionOrderDto> createProductionOrder(
            @Valid @RequestBody CreateProductionOrderRequest request) {
        
        ProductionOrder order = productionOrderService.createOrder(request);
        ProductionOrderDto dto = mapToDto(order);
        
        URI location = ServletUriComponentsBuilder
            .fromCurrentRequest()
            .path("/{id}")
            .buildAndExpand(order.getOrderId())
            .toUri();
            
        return ResponseEntity.created(location).body(dto);
    }
    
    @PutMapping("/{orderId}/start")
    @Operation(summary = "Start production order")
    public ResponseEntity<Void> startProductionOrder(
            @PathVariable String orderId,
            @Valid @RequestBody StartProductionRequest request) {
        
        productionOrderService.startOrder(orderId, request);
        return ResponseEntity.ok().build();
    }
    
    @PutMapping("/{orderId}/complete")
    @Operation(summary = "Complete production order")
    public ResponseEntity<ProductionOrderDto> completeProductionOrder(
            @PathVariable String orderId,
            @Valid @RequestBody CompleteProductionRequest request) {
        
        ProductionOrder order = productionOrderService.completeOrder(orderId, request);
        return ResponseEntity.ok(mapToDto(order));
    }
    
    @GetMapping("/{orderId}/events")
    @Operation(summary = "Get production order events")
    public ResponseEntity<List<ProductionEventDto>> getProductionEvents(
            @PathVariable String orderId) {
        
        List<ProductionEvent> events = productionOrderService.getOrderEvents(orderId);
        List<ProductionEventDto> eventDtos = events.stream()
            .map(this::mapEventToDto)
            .collect(Collectors.toList());
            
        return ResponseEntity.ok(eventDtos);
    }
    
    @ExceptionHandler(ProductionOrderNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleOrderNotFound(ProductionOrderNotFoundException e) {
        ErrorResponse error = ErrorResponse.builder()
            .timestamp(LocalDateTime.now())
            .status(HttpStatus.NOT_FOUND.value())
            .error("Production Order Not Found")
            .message(e.getMessage())
            .path(request.getRequestURI())
            .build();
            
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }
}
```

### GraphQL Implementation

#### Schema et Resolvers GraphQL
```java
@Component
public class ProductionOrderResolver implements GraphQLQueryResolver, GraphQLMutationResolver {
    
    @Autowired
    private ProductionOrderService productionOrderService;
    
    @Autowired
    private DataFetchingEnvironment dataFetchingEnvironment;
    
    // Query Resolvers
    public Page<ProductionOrder> productionOrders(
            String status,
            String workCenter,
            LocalDate startDate,
            LocalDate endDate,
            int page,
            int size,
            DataFetchingEnvironment env) {
        
        // Optimization: ne récupère que les champs demandés
        Set<String> requestedFields = getRequestedFields(env);
        
        ProductionOrderFilter filter = ProductionOrderFilter.builder()
            .status(status)
            .workCenter(workCenter)
            .startDate(startDate)
            .endDate(endDate)
            .build();
            
        Pageable pageable = PageRequest.of(page, size);
        
        return productionOrderService.findOrders(filter, pageable, requestedFields);
    }
    
    public ProductionOrder productionOrder(String orderId, DataFetchingEnvironment env) {
        Set<String> requestedFields = getRequestedFields(env);
        return productionOrderService.findById(orderId, requestedFields);
    }
    
    // Nested field resolvers avec DataLoader pour éviter N+1
    public CompletableFuture<List<WorkOrder>> workOrders(ProductionOrder productionOrder, DataFetchingEnvironment env) {
        DataLoader<String, List<WorkOrder>> dataLoader = env.getDataLoader("workOrdersDataLoader");
        return dataLoader.load(productionOrder.getOrderId());
    }
    
    public CompletableFuture<Product> product(ProductionOrder productionOrder, DataFetchingEnvironment env) {
        DataLoader<String, Product> dataLoader = env.getDataLoader("productsDataLoader");
        return dataLoader.load(productionOrder.getProductId());
    }
    
    // Mutation Resolvers
    public ProductionOrder createProductionOrder(CreateProductionOrderInput input) {
        CreateProductionOrderRequest request = mapInputToRequest(input);
        return productionOrderService.createOrder(request);
    }
    
    public ProductionOrder startProductionOrder(String orderId, StartProductionInput input) {
        StartProductionRequest request = mapInputToRequest(input);
        return productionOrderService.startOrder(orderId, request);
    }
    
    private Set<String> getRequestedFields(DataFetchingEnvironment env) {
        return env.getSelectionSet().getFields().stream()
            .map(field -> field.getName())
            .collect(Collectors.toSet());
    }
}

// DataLoader Configuration
@Configuration
public class GraphQLDataLoaderConfiguration {
    
    @Bean
    public DataLoaderRegistry dataLoaderRegistry() {
        DataLoaderRegistry registry = new DataLoaderRegistry();
        
        // Work Orders DataLoader
        DataLoader<String, List<WorkOrder>> workOrdersLoader = DataLoader.newMappedDataLoader(
            orderIds -> CompletableFuture.supplyAsync(() -> 
                workOrderService.findByProductionOrderIds(orderIds)
            )
        );
        registry.register("workOrdersDataLoader", workOrdersLoader);
        
        // Products DataLoader
        DataLoader<String, Product> productsLoader = DataLoader.newMappedDataLoader(
            productIds -> CompletableFuture.supplyAsync(() ->
                productService.findByIds(productIds).stream()
                    .collect(Collectors.toMap(Product::getProductId, Function.identity()))
            )
        );
        registry.register("productsDataLoader", productsLoader);
        
        return registry;
    }
}
```

## Bases de Données et Stockage

### Time-Series Database avec TimescaleDB

#### Configuration et Optimisation
```sql
-- Extension TimescaleDB
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;

-- Table principale pour données processus
CREATE TABLE process_data (
    timestamp TIMESTAMPTZ NOT NULL,
    equipment_id VARCHAR(50) NOT NULL,
    parameter_name VARCHAR(100) NOT NULL,
    value DOUBLE PRECISION,
    quality_code INTEGER DEFAULT 192, -- Good quality
    unit_of_measure VARCHAR(20),
    source_system VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversion en hypertable (partitioning automatique)
SELECT create_hypertable('process_data', 'timestamp', chunk_time_interval => INTERVAL '1 day');

-- Index optimisés pour requêtes temporelles
CREATE INDEX idx_process_data_equipment_time ON process_data (equipment_id, timestamp DESC);
CREATE INDEX idx_process_data_parameter_time ON process_data (parameter_name, timestamp DESC);
CREATE INDEX idx_process_data_quality ON process_data (quality_code) WHERE quality_code != 192;

-- Compression automatique des données anciennes
ALTER TABLE process_data SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'equipment_id, parameter_name',
    timescaledb.compress_orderby = 'timestamp DESC'
);

-- Politique de compression (après 7 jours)
SELECT add_compression_policy('process_data', INTERVAL '7 days');

-- Politique de rétention (2 ans)
SELECT add_retention_policy('process_data', INTERVAL '2 years');

-- Agrégations continues pour reporting
CREATE MATERIALIZED VIEW process_data_hourly
WITH (timescaledb.continuous) AS
SELECT 
    time_bucket('1 hour', timestamp) AS hour,
    equipment_id,
    parameter_name,
    AVG(value) as avg_value,
    MIN(value) as min_value,
    MAX(value) as max_value,
    COUNT(*) as sample_count,
    STDDEV(value) as std_deviation
FROM process_data
WHERE quality_code = 192 -- Good quality only
GROUP BY hour, equipment_id, parameter_name
WITH NO DATA;

-- Politique de refresh automatique
SELECT add_continuous_aggregate_policy('process_data_hourly',
    start_offset => INTERVAL '2 hours',
    end_offset => INTERVAL '10 minutes',
    schedule_interval => INTERVAL '10 minutes');
```

#### Repository Spring Data optimisé
```java
@Repository
public interface ProcessDataRepository extends JpaRepository<ProcessData, Long> {
    
    @Query(value = """
        SELECT * FROM process_data 
        WHERE equipment_id = :equipmentId 
          AND parameter_name = :parameterName
          AND timestamp BETWEEN :startTime AND :endTime
          AND quality_code = 192
        ORDER BY timestamp ASC
        """, nativeQuery = true)
    List<ProcessData> findByEquipmentAndParameterInTimeRange(
        @Param("equipmentId") String equipmentId,
        @Param("parameterName") String parameterName,
        @Param("startTime") Instant startTime,
        @Param("endTime") Instant endTime
    );
    
    @Query(value = """
        SELECT 
            time_bucket('1 minute', timestamp) as bucket,
            AVG(value) as avg_value,
            MIN(value) as min_value,
            MAX(value) as max_value
        FROM process_data 
        WHERE equipment_id = :equipmentId 
          AND parameter_name = :parameterName
          AND timestamp BETWEEN :startTime AND :endTime
          AND quality_code = 192
        GROUP BY bucket
        ORDER BY bucket ASC
        """, nativeQuery = true)
    List<Object[]> findAggregatedDataByMinute(
        @Param("equipmentId") String equipmentId,
        @Param("parameterName") String parameterName,
        @Param("startTime") Instant startTime,
        @Param("endTime") Instant endTime
    );
    
    @Modifying
    @Query(value = """
        INSERT INTO process_data (timestamp, equipment_id, parameter_name, value, quality_code, unit_of_measure)
        VALUES (:timestamp, :equipmentId, :parameterName, :value, :qualityCode, :unitOfMeasure)
        ON CONFLICT (timestamp, equipment_id, parameter_name) 
        DO UPDATE SET 
            value = EXCLUDED.value,
            quality_co