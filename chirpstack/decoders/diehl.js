
const diehlDecoder = (message) => {
    var RFConfiguration = ["Config 0","Config 1","Config 2","Config 3","Config 4","LoRaWan","Config 6","Config 7"];
    var TypeOfNetwork = ["Public","Private","Hybrid"];
    var TransmissionPower = ["20dBm","14dBm","11dBm","8dBm","5dBm","2dBm"];
    var DataRate = ["LoRa: SF12/125 kHz","LoRa: SF11/125 kHz","LoRa: SF10/125 kHz","LoRa: SF9/125 kHz","LoRa: SF8/125 kHz","LoRa: SF7/125 kHz","LoRa: SF7/250 kHz","FSK/50 kbps"];   
    var PulseWeight = [1, 1, 1, 1, 1, 10, 1, 10, 100, 1000, 100];    
    var Hex2Str = [ 
        "00","01","02","03","04","05","06","07","08","09","0A","0B","0C","0D","0E","0F","10","11","12","13","14","15","16","17","18","19","1A","1B","1C","1D","1E","1F",
        "20","21","22","23","24","25","26","27","28","29","2A","2B","2C","2D","2E","2F","30","31","32","33","34","35","36","37","38","39","3A","3B","3C","3D","3E","3F", 
        "40","41","42","43","44","45","46","47","48","49","4A","4B","4C","4D","4E","4F","50","51","52","53","54","55","56","57","58","59","5A","5B","5C","5D","5E","5F", 
        "60","61","62","63","64","65","66","67","68","69","6A","6B","6C","6D","6E","6F","70","71","72","73","74","75","76","77","78","79","7A","7B","7C","7D","7E","7F", 
        "80","81","82","83","84","85","86","87","88","89","8A","8B","8C","8D","8E","8F","90","91","92","93","94","95","96","97","98","99","9A","9B","9C","9D","9E","9F", 
        "A0","Al","A2","A3","A4","A5","A6","A7","A8","A9","AA","AB","AC","AD","AE","AF","B0","Bl","B2","B3","B4","B5","B6","B7","B8","B9","BA","BB","BC","BD","BE","BF", 
        "C0","Cl","C2","C3","C4","C5","C6","C7","C8","C9","CA","CB","CC","CD","CE","CF","D0","Dl","D2","D3","D4","D5","D6","D7","D8","D9","DA","DB","DC","DD","DE","DF", 
        "E0","El","E2","E3","E4","E5","E6","E7","E8","E9","EA","EB","EC","ED","EE","EF","F0","Fl","F2","F3","F4","F5","F6","F7","F8","F9","FA","FB","FC","FD","FE","FF",
    ];
    var EC1 = [ 
        0,1,2,3,4,5,6,7,8,9,10,12,14,16,18,20,22,24,26,28,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,
        185,190,195,200,210,220,230,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,420,440,460,480,500,520,540,560,580,600,620,640,660,680,700,720,
        740,760,780,800,840,880,920,960,1000,1040,1080,1120,1160,1200,1240,1280,1320,1360,1400,1440,1480,1520,1560,1600,1680,1760,1840,1920,2000,2080,2160,2240,2320,2400,
        2480,2560,2640,2720,2800,2880,2960,3040,3120,3200,3360,3520,3680,3840,4000,4160,4320,4480,4640,4800,4960,5120,5280,5440,5600,5760,5920,6080,6240,6400,6720,7040,
        7360,7680,8000,8320,8640,8960,9280,9600,9920,10240,10560,10880,11200,11520,11840,12160,12480,12800,13440,14080,14720,15360,16000,16640,17280,17920,18560,19200,19840, 
        20480,21120,21760,22400,23040,23680,24320,24960,25600,26880,28160,29440,30720,32000,33280,34560,35840,37120,38400,39680,40960,42240,43520,44800,46080,47360,48640,
        49920,51200,53760,56320,58880,61440,64000,66560,69120,71680,74240,76800,79360,81920,84480,87040,89600,92160,94720,97280,99840,102400,107520,112640,117760,122880,
        128000,133120,138240,143360,148480,153600,158720,163840,168960,174080,179200,184320,189440,194560,199680, 'Overflow' , 'Anomaly'
    ]; 
    var EC2 = [ 
        0,0.0025,0.0051,0.005304,0.00551616,0.005736807,0.005966279,0.00620493,0.006453127,0.006711252,0.006979702,0.00725889,0.007549246,0.007851216,0.008165265,0.008491875,
        0.00883155,0.009184812,0.009552204,0.009934293,0.010331665,0.010744931,0.011174728,0.011621717,0.012086586,0.01257005,0.013072852,0.013595766,0.014139596,0.01470518,
        0.015293387,0.015905123,0.016541328,0.017202981,0.0178911,0.018606744,0.019351014,0.020125054,0.020930056,0.021767258,0.022637949,0.023543467,0.024485205,0.025464614,
        0.026483198,0.027542526,0.028644227,0.029789996,0.030981596,0.03222086,0.033509694,0.034850082,0.036244085,0.037693849,0.039201603,0.040769667,0.042400454,0.044096472, 
        0.04586033,0.047694743,0.049602533,0.051586635,0.0536501,0.055796104,0.058027948,0.060349066,0.062763029,0.06527355,0.067884492,0.070599871,0.073423866,0.076360821,
        0.079415254,0.082591864,0.085895539,0.08933136,0.092904614,0.096620799,0.100485631,0.104505056,0.108685259,0.113032669,0.117553975,0.122256134,0.12714638,0.132232235,
        0.137521525,0.143022386,0.148743281,0.154693012,0.160880732,0.167315962,0.1740086,0.180968944,0.188207702,0.19573601,0.203565451,0.211708069,0.220176391,0.228983447,
        0.238142785,0.247668496,0.257575236,0.267878246,0.278593375,0.28973711,0.301326595,0.313379658,0.325914845,0.338951439,0.352509496,0.366609876,0.381274271,0.396525242, 
        0.412386251,0.428881701,0.446036969,0.463878448,0.482433586,0.50173093,0.521800167,0.542672173,0.56437906,0.586954223,0.610432392,0.634849687,0.660243675,0.686653422,
        0.714119559,0.742684341,0.772391715,0.803287383,0.835418879,0.868835634,0.903589059,0.939732621,0.977321926,1.016414803,1.057071395,1.099354251,1.143328421,1.189061558,
        1.23662402,1.286088981,1.33753254,1.391033842,1.446675196,1.504542204,1.564723892,1.627312847,1.692405361,1.760101576,1.830505639,1.903725864,1.979874899,2.059069895,
        2.14143269,2.227089998,2.316173598,2.408820542,2.505173363,2.605380298,2.70959551,2.81797933,2.930698504,3.047926444,3.169843501,3.296637241,3.428502731,3.56564284, 
        3.708268554,3.856599296,4.010863268,4.171297798,4.33814971,4.511675699,4.692142727,4.879828436,5.075021573,5.278022436,5.489143334,5.708709067,5.937057429,6.174539727,
        6.421521316,6.678382168,6.945517455,7.223338153,7.512271679,7.812762547,8.125273048,8.45028397,8.788295329,9.139827142,9.505420228,9.885637038,10.28106252,10.69230502,
        11.11999722,11.56479711,12.027389,12.50848456,13.00882394,13.52917689,14.07034397,14.63315773,15.21848404,15.8272234,16.46031233,17.11872483,17.80347382,18.51561277,
        19.25623728,20.02648678,20.82754625,2,1.66064809,22.52707402,23.42815698,24.36528326,25.33989459,26.35349038,27.40762999,28.50393519,29.6440926,30.8298563,32.06305055, 
        33.34557258,34.67939548,36.0665713,37.50923415,39.00960351,40.56998766,42.19278716,43.88049865,45.63571859,47.46114734,49.19587904,100,-0.25,-0.75,-1.5,-2.5,-3.5,-4.5,
        -5.5,-7.5,-10.5,-13.5,-17.5, -22.5, -27.5, -32.5, -37.5, -42.5, -47.5, -100
    ]; 
    var decoded = {};
    // Hex to Signed Int conversion for a DWORD (32bits)
    function Hex2SignedDWord(hex) {
        if (hex.length % 2 != 0) {
            hex = "0" + hex;
        };
        var num = parseInt(hex, 16);
        var maxVal = Math.pow(2, 32);
        if (num > maxVal / 2 - 1) {
            num = num - maxVal
        };
        return num;
    };
    // Macro Alarms decoding
    function MacroAlarmInterpretation(tmp){
        if ((tmp&0x60)==0x40) decoded.MacroAlarme_InProgressPersistence = 1; 
        else decoded.MacroAlarme_InProgressPersistence = 0;
        if ((tmp&0x60)==0x60) decoded.MacroAlarme_InProgressImpactingPersistence = 1; 
        else decoded.MacroAlarme_InProgressImpactingPersistence = 0;
    }
    // Micro Alarms decoding
    function MicroAlarmInterpretation(tmp1,tmp2,tmp3,tmp4,tmp5){
        decoded.MicroAlarme_Metrology_BlockedMeter = tmp1 & 0x01;
        decoded.MicroAlarme_Metrology_OverFlowSmallSize = (tmp1 >> 6) & 0x01;
        decoded.MicroAlarme_Metrology_OverFlowLargeSize = (tmp1 >> 7) & 0x01;
        decoded.MicroAlarme_System_Battery = (tmp2 >> 7) & 0x01;
        decoded.MicroAlarme_System_ClockUpdated = tmp3 & 0x01;
        decoded.MicroAlarme_System_ModuleReconfigured = (tmp3 >> 3) & 0x01;
        decoded.MicroAlarme_System_DatabasePurge = (tmp3 >> 4) & 0x01;
        decoded.MicroAlarme_System_NoiseDefense = (tmp3 >> 6) & 0x01;
        decoded.MicroAlarme_System_LowTemperature = tmp4 & 0x01;
        decoded.MicroAlarme_System_NumberOfAlarmCycleAuthorizedReached = (tmp4 >> 1) & 0x01;
        decoded.MicroAlarme_Tamper_ReversedMeter = (tmp4 >> 3) & 0x01;
        decoded.MicroAlarme_Tamper_Module_tampered = (tmp4 >> 5) & 0x01;
        decoded.MicroAlarme_Tamper_AcquisitionStageFailure = (tmp4 >> 6) & 0x01;
        decoded.MicroAlarme_WaterQuality_Backflow = tmp5 & 0x01;
        decoded.MicroAlarme_StopPersistence = (tmp5 >> 4) & 0x01;
    }

    if (message.hasOwnProperty('fPort') && message.hasOwnProperty('data')) {
        var fPort = message.fPort;
        if (fPort == 3) {
            var bytes = Buffer.from(message.data, 'base64');
            // Frame Type
            decoded.FrameType = bytes[0] & 0x0F;
            // Comuting depending of Frame Type
            switch(decoded.FrameType){
                // Frame Type DS51_OE : On Event
                case 0 :
                    decoded.MeterKey = bytes[44] & 0x0F;
                    decoded.PulseWeight = PulseWeight[decoded.MeterKey-1];
                    decoded.SequenceInCalendar = bytes[0] >> 4;
                    decoded.AlarmsCauses_Tamper = (bytes[2] >> 2) & 0x01;
                    decoded.AlarmsCauses_Backflow = (bytes[2] >> 3) & 0x01;
                    decoded.AlarmsCauses_FlowPersistenceInProgress = (bytes[2] >> 4) & 0x01;
                    decoded.AlarmsCauses_StopPersistenceInProgress = (bytes[2] >> 5) & 0x01;
                    decoded.MicroAlarme_Metrology_BlockedMeter = bytes[3] & 0x01;
                    decoded.MicroAlarme_Metrology_OverFlowSmallSize = (bytes[3] >> 6) & 0x01;
                    decoded.MicroAlarme_Metrology_OverFlowLargeSize = (bytes[3] >> 7) & 0x01;
                    decoded.MicroAlarme_System_Battery = (bytes[4] >> 7) & 0x01;
                    decoded.MicroAlarme_System_ClockUpdated = bytes[5] & 0x01;
                    decoded.MicroAlarme_System_ModuleReconfigured = (bytes[5] >> 3) & 0x01;
                    decoded.MicroAlarme_System_DatabasePurge = (bytes[5] >> 4) & 0x01;
                    decoded.MicroAlarme_System_NoiseDefense = (bytes[5] >> 6) & 0x01;
                    decoded.MicroAlarme_System_LowTemperature = bytes[6] & 0x01;
                    decoded.MicroAlarme_System_NumberOfAlarmCycleAuthorizedReached = (bytes[6] >> 1) & 0x01;
                    decoded.MicroAlarme_Tamper_ReversedMeter = (bytes[6] >> 3) & 0x01;
                    decoded.MicroAlarme_Tamper_Module_tampered = (bytes[6] >> 5) & 0x01;
                    decoded.MicroAlarme_Tamper_AcquisitionStageFailure = (bytes[6] >> 6) & 0x01;
                    decoded.MicroAlarme_WaterQuality_Backflow = bytes[7] & 0x01;
                    decoded.MicroAlarme_StopPersistence = (bytes[7] >> 4) & 0x01;
                    decoded.NonZeroMinFlow = EC1[bytes[8]];
                    decoded.MaxFlow = EC1[bytes[10]];
                    decoded.Backflow_NumberOfAlternation = EC1[bytes[12]];
                    decoded.Backflow_CumulatedVolume = EC1[bytes[13]];
                    decoded.Flow_DurationOfPersistenceFlowEqualToZero = bytes[19] & 0x0F;
                    decoded.Flow_DurationOfPersistenceFlowOverZero = bytes[20] >> 4;
                    decoded.DS51_OE_FrameRepetitionNumber = bytes[31] & 0x03;
                    decoded.NumberOfSecondsSince01January2012AtMidnight = bytes[32] + 256*bytes[33]+ 256*256*bytes[34]+ 256*256*256*bytes[35];
                    decoded.LoRaWanStatistics_RadioSerialNumber = "5322."+Hex2Str[bytes[38]]+"."+Hex2Str[bytes[39]]+"."+Hex2Str[bytes[40]]+"."+Hex2Str[bytes[41]]+"."+Hex2Str[bytes[42]]+"."+Hex2Str[bytes[43]];
                    break;
                // Frame Type DS51_A : E17Z Periodical Frame
                case 10 :
                    decoded.E17Z_PeriodicalFrame_SequenceNumber = bytes[0] >> 4; // Sequence number of the periodical frame
                    MacroAlarmInterpretation(bytes[2]);
                    MicroAlarmInterpretation(bytes[3],bytes[4],bytes[5],bytes[6],bytes[7]);
                    decoded.Index0h00 = Hex2SignedDWord((bytes[8]+256*bytes[9]+256*256*bytes[10]+256*256*256*bytes[11]).toString(16)); // Midnight Index in pulses
                    decoded.DateTime_TransmissionTimeStamp = (bytes[50]>>3) + "h" + (((bytes[50]&0x07)<<3) + (bytes[49]>>5)) + "mn"; //Hour & Minutes of frame transmission
                    decoded.MeterKey = bytes[49]&0x0F;
                    decoded.ForwardFlow_Last24Hours_Sum = bytes[12]+256*bytes[13]+256*256*(bytes[14]&0x0F) // Fowardflow volume during the last 24 hours in pulses
                    decoded.BackFlow_Last24Hours_Sum = bytes[15]+256*bytes[16]+256*256*(bytes[14]>>4) // Backflow volume during the last 24 hours in pulses
                    // Decode the hourly consumption in percentage (First element = h-24) and compute the hourly consumption in pulses
                    decoded.ConsumptionPercentage = [];
                    decoded.ConsumptionPulses = [];
                    var TmpNumberOfPositiveValues = 0;
                    var TmpNumberOfNegativeValues = 0;
                    var TmpPositionOfMaxPositiveValues = -1;
                    var TmpPositionOfMaxNegativeValues = -1;
                    var TmpValueOfMaxPositiveValuesInPercentage = 0;
                    var TmpValueOfMaxNegativeValuesInPercentage = 0;
                    // 1st loop in the array to get min value, max value, positions in the array of min & max values.
                    for(var i=0;i<24;i++){
                        decoded.ConsumptionPercentage[i] = EC2[bytes[i+17]];
                        if (decoded.ConsumptionPercentage[i] == 0) decoded.ConsumptionPulses[i] = 0;
                        if (decoded.ConsumptionPercentage[i] > 0){ // Only if positive values
                            decoded.ConsumptionPulses[i] = Math.round(decoded.ConsumptionPercentage[i]*decoded.ForwardFlow_Last24Hours_Sum/100); // Compute the pulses
                            TmpNumberOfPositiveValues++; // count the number of positive % values
                            if (decoded.ConsumptionPercentage[i] > TmpValueOfMaxPositiveValuesInPercentage){
                                TmpValueOfMaxPositiveValuesInPercentage = decoded.ConsumptionPercentage[i]; // store the maximum value
                                TmpPositionOfMaxPositiveValues = i; // store the position in the array of the maximum value
                            };
                        };
                        if (decoded.ConsumptionPercentage[i] < 0){
                            decoded.ConsumptionPulses[i] = Math.round(decoded.ConsumptionPercentage[i]*decoded.BackFlow_Last24Hours_Sum/100); // Compute the pulses
                            TmpNumberOfNegativeValues++; // count the number of negative % values
                            if (decoded.ConsumptionPercentage[i] < TmpValueOfMaxNegativeValuesInPercentage){
                                TmpValueOfMaxNegativeValuesInPercentage = decoded.ConsumptionPercentage[i]; // store the minimum value
                                TmpPositionOfMaxNegativeValues = i;// store the position in the array of the minimum value
                            };
                        };
                    };
                    // 2nd loop in the array to compute each maximum values
                    var TmpSumOfPositiveValuesInPercentage = 0;
                    var TmpSumOfNegativeValuesInPercentage = 0;
                    var TmpSumOfPositiveValuesInPulses = 0;
                    var TmpSumOfNegativeValuesInPulses = 0;
                    for(var i=0;i<24;i++){
                        if (decoded.ConsumptionPercentage[i] > 0){ // Only if positive values
                            if ((TmpPositionOfMaxPositiveValues > -1) && (TmpPositionOfMaxPositiveValues != i)){
                                TmpSumOfPositiveValuesInPercentage = TmpSumOfPositiveValuesInPercentage + decoded.ConsumptionPercentage[i];
                                TmpSumOfPositiveValuesInPulses = TmpSumOfPositiveValuesInPulses + decoded.ConsumptionPulses[i];
                            };
                        };
                        if (decoded.ConsumptionPercentage[i] < 0){ // Only if negative values
                            if ((TmpPositionOfMaxNegativeValues > -1) && (TmpPositionOfMaxNegativeValues != i)){
                            TmpSumOfNegativeValuesInPercentage = TmpSumOfNegativeValuesInPercentage + decoded.ConsumptionPercentage[i];
                            TmpSumOfNegativeValuesInPulses = TmpSumOfNegativeValuesInPulses + decoded.ConsumptionPulses[i];
                            };
                        };
                    };
                    if (TmpPositionOfMaxPositiveValues > -1) decoded.ConsumptionPercentage[TmpPositionOfMaxPositiveValues] = 100 - TmpSumOfPositiveValuesInPercentage // Update Maximum Value by the re-computed one
                    if (TmpPositionOfMaxNegativeValues > -1) decoded.ConsumptionPercentage[TmpPositionOfMaxNegativeValues] = -100 - TmpSumOfNegativeValuesInPercentage // Update Minimum Value by the re-computed one
                    if (TmpPositionOfMaxPositiveValues > -1) decoded.ConsumptionPulses[TmpPositionOfMaxPositiveValues] = decoded.ForwardFlow_Last24Hours_Sum - TmpSumOfPositiveValuesInPulses // Update Maximum Value by the re-computed one
                    if (TmpPositionOfMaxNegativeValues > -1) decoded.ConsumptionPulses[TmpPositionOfMaxNegativeValues] = -decoded.BackFlow_Last24Hours_Sum - TmpSumOfNegativeValuesInPulses // Update Minimum Value by the re-computed one
                    break;
                // Frame Type DS51_2 : E17Z Monthly Frame
                case 11 :
                    decoded.E17Z_PeriodicalFrame_SequenceNumber = bytes[0] >> 4; // Sequence number of the periodical frame
                    decoded.MeterKey = bytes[2] >> 4;
                    decoded.PulseWeight = PulseWeight[decoded.MeterKey-1];
                    decoded.Configuration_IndexOffsetConfiguredDuringTheInstallation = (bytes[2] >> 1) & 0x01;
                    decoded.Configuration_SummerWinterTimeManagementEnabled = bytes[3] & 0x01;
                    decoded.Configuration_DS51_1x_AND_DS51_OE_Enabled = bytes[4] & 0x01;
                    decoded.Configuration_DS51_5_Enabled = (bytes[4] >> 1) & 0x01;
                    decoded.Configuration_WBDB_Enabled = (bytes[4] >> 3) & 0x01;
                    decoded.Configuration_LoRaWANProtocol_Enabled = (bytes[4] >> 4) & 0x01;
                    if (((bytes[4] >> 5) & 0x01) == 0x01) decoded.Configuration_ConnectionMethode = "ABP"; 
                    else decoded.Configuration_ConnectionMethode = "OTAA";
                    decoded.Configuration_TypeOfNetwork = TypeOfNetwork[((bytes[4] & 0xC0) >> 6)];
                    decoded.Configuration_ADR_Enabled = bytes[5] & 0x01;
                    decoded.Configuration_LossSessionManagement_Enabled = (bytes[5] >> 1) & 0x01;
                    decoded.EnergyConsumptionInPercentage = bytes[14]*0.4 + "%"// Power consumption in %
                    decoded.MaxFlow = EC1[bytes[32]];
                    decoded.LoRaWanStatistics_TransmissionPower = TransmissionPower[((bytes[36] & 0xF0) >> 4)];
                    decoded.LoRaWanStatistics_DataRate = DataRate[(bytes[36] & 0x0F)];
                    decoded.LoRaWanStatistics_CounterOfTransmittedFrames = bytes[37]*16 + (bytes[38]>>4);
                    decoded.LoRaWanStatistics_CounterOfReceivedFrames = EC1[(bytes[38] & 0x0F)*16 + (bytes[39]>>4)];
                    decoded.LoRaWanStatistics_NumberOfConfigurationChangesDuringLastMonth = bytes[39] & 0x0F;
                    decoded.LoRaWanStatistics_NetworkSettingForBandwithOccupation = bytes[40] >> 4;
                    decoded.LoRaWanStatistics_NetworkSettingForNumberOfFrameRepetition = bytes[40] & 0x0F;
                    decoded.LoRaWanStatistics_PercentageOfNonApplicativeFrameSent = (0.4*bytes[41]*decoded.LoRaWanStatistics_CounterOfTransmittedFrames)/100 + "%";
                    decoded.LoRaWanStatistics_NumberOfActiveChannels = bytes[42] >> 3;
                    decoded.LoRaWanStatistics_Channel1Activated = bytes[42] & 0x01;
                    decoded.LoRaWanStatistics_Channel2Activated = (bytes[42]>>1) & 0x01;
                    decoded.LoRaWanStatistics_Channel3Activated = (bytes[42]>>2) & 0x01;
                    decoded.LoRaWanStatistics_TotalTimeSpentWithRadioReceiver = (bytes[44] & 0x3F)*256 + bytes[43];
                    break;
            };
            // Display Payload in a string
            var Payload = "";
            for (var i=0;i<bytes.length;i++){
                Payload = Payload + bytes[i].toString(16);
            };
            decoded.Payload = Payload; // Full Payload in a string
            var time = decoded.DateTime_TransmissionTimeStamp;
            var hourlog = parseInt(time.slice(0, 2));
            var minlog = parseInt(time.slice(3, 5));
            var datelog = new Date();
            datelog.setHours(hourlog-23);
            datelog.setMinutes(0);
            datelog.setSeconds(0);
            datelog.setMilliseconds(0);
            var date = new Date();
            date.setHours(hourlog);
            date.setMinutes(0);
            date.setSeconds(0);
            datelog.setMilliseconds(0);
            var hour = date.getHours();
            //hour=hour;
            date.setHours(hour);
            var alarm = [];
            if (decoded.MicroAlarme_Metrology_BlockedMeter == 1) {
                alarm.push("Contador bloqueado");
            };
            if (decoded.MicroAlarme_Metrology_OverFlowSmallSize == 1) {
                alarm.push("Over Flow Small Size");
            };
            if (decoded.MicroAlarme_Metrology_OverFlowLargeSize == 1) {
                alarm.push("Over Flow Large Size");
            };
            if (decoded.MicroAlarme_System_Battery == 1) {
                alarm.push("Bateria fraca");
            };
            if (decoded.MicroAlarme_System_ClockUpdated == 1) {
                alarm.push("Clock Updated");
            };
            if (decoded.MicroAlarme_System_ModuleReconfigured == 1) {
                alarm.push("Módulo reconfigurado");
            };
            if (decoded.MicroAlarme_System_NoiseDefense == 1) {
                alarm.push("Noise Defense");
            };
            if (decoded.MicroAlarme_System_LowTemperature == 1) {
                alarm.push("Gelo");
            };
            if (decoded.MicroAlarme_System_Number0fAlarmCycleAuthorizedReached == 1) {
                alarm.push("Number 0f Alarm Cycle Authorized Reached");
            };
            if (decoded.MicroAlarme_Tamper_ReversedMeter == 1) {
                alarm.push("Reversed Meter");
            };
            if (decoded.MicroAlarme_Tamper_Module_tampered == 1) {
                alarm.push("Manipulação mecânica");
            };
            if (decoded.MicroAlarme_Tamper_AcquisitionStageFailure == 1) {
                alarm.push("Acquisition Stage Failure");
            };
            if (decoded.MicroAlarme_WaterQuality_Backflow == 1) {
                alarm.push("Fluxo inverso");
            };
            if (alarm.length == 0){
                alarm.push("No Alarms");
            }; 
            var rxinfo_length = message.rxInfo.length;
            var snr = [];
            var index;
            for (var a = 0; a < rxinfo_length; a++) {
                snr.push (
                    message.rxInfo[a].loRaSNR
                );
                var max = Math.max(...snr);
                index = snr.indexOf(max);
            };
            var gatewayID = (Buffer.from(message.rxInfo[index].gatewayID, 'base64')).toString('hex');
            var payload = {
                "AppID": message.applicationID,
                "Application": message.applicationName,
                "DeviceName": message.tags.CONTADOR,
                "Data": message.data,
                "fPort": message.fPort,
                "Alarm": alarm,
                "Date": date,
                "Datelog": datelog,
                "Volume": parseFloat((decoded.Index0h00*0.001).toFixed(2)),
                "Deltas": decoded.ConsumptionPulses,
                "gateway": gatewayID,
                "rssi": message.rxInfo[index].rssi,
                "snr": message.rxInfo[index].loRaSNR,
                "sf": message.txInfo.loRaModulationInfo.spreadingFactor
            };
            return payload;
        };
    };   
};

export { diehlDecoder };



    
    
    
    
   