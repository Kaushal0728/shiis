import {
  Injectable,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';

@Injectable()
export class PatientService {
  private readonly logger = new Logger(PatientService.name);

  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  /**
   * Get all patients with optional pagination
   */
  async findAll(
    page = 1,
    limit = 20,
  ): Promise<{ data: Patient[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;

    const [data, total] = await this.patientRepository.findAndCount({
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });

    this.logger.log(`Fetched ${data.length} patients (page ${page})`);
    return { data, total, page, limit };
  }

  /**
   * Get a single patient by ID
   */
  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { patientId: id },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID ${id} not found`);
    }

    return patient;
  }

  /**
   * Create a new patient
   */
  async create(dto: CreatePatientDto): Promise<Patient> {
    const patient = this.patientRepository.create(dto);
    const saved = await this.patientRepository.save(patient);
    this.logger.log(`Created patient ID ${saved.patientId}`);
    return saved;
  }

  /**
   * Update an existing patient
   */
  async update(id: number, dto: UpdatePatientDto): Promise<Patient> {
    const patient = await this.findOne(id); // throws if not found
    Object.assign(patient, dto);
    const updated = await this.patientRepository.save(patient);
    this.logger.log(`Updated patient ID ${id}`);
    return updated;
  }

  /**
   * Delete a patient by ID
   */
  async remove(id: number): Promise<{ message: string }> {
    const patient = await this.findOne(id); // throws if not found
    await this.patientRepository.remove(patient);
    this.logger.log(`Deleted patient ID ${id}`);
    return { message: `Patient ${id} deleted successfully` };
  }

  /**
   * Search patients by name
   */
  async search(query: string): Promise<Patient[]> {
    return this.patientRepository
      .createQueryBuilder('patient')
      .where('patient.first_name LIKE :query', { query: `%${query}%` })
      .orWhere('patient.last_name LIKE :query', { query: `%${query}%` })
      .orderBy('patient.created_at', 'DESC')
      .getMany();
  }
}
