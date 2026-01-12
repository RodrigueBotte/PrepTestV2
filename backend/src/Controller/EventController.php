<?php

namespace App\Controller;

use App\Entity\Event;
use DateTime;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

final class EventController extends AbstractController
{
    #[Route('/api/event', name: 'app_event_index', methods: ['GET'])]
    public function index(EntityManagerInterface $em, SerializerInterface $serializer): JsonResponse {
        $events = $em->getRepository(Event::class)->findAll();
        $data = array_map(function($event) {
        return [
            'id' => $event->getId(),
            'title' => $event->getTitle(),
            'date' => $event->getDate()->format('Y-m-d')
        ];
        }, $events);

        return new JsonResponse($data);
    }
    
    #[Route('/api/events', name: 'app_event_create', methods: ['POST'])]
    public function create(EntityManagerInterface $em, Request $rq) : JsonResponse {
        $data = json_decode($rq->getContent(), true);
        $event = new Event();
        $event->setTitle($data['title']);
        $event->setDate(new \DateTimeImmutable($data['date']));

        $em->persist($event);
        $em->flush();

        return new JsonResponse($event, 201);
    }

    #[Route('/api/events/{id}', name:'app_event_delete', methods:['DELETE'])]
    public function delete(Event $event, EntityManagerInterface $em): JsonResponse {
        $em->remove($event);
        $em->flush();
        return new JsonResponse(null, 204);
    }
}
