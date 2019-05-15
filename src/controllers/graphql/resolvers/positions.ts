import {
    GraphMutationUpdateOwnPositionArgs,
    GraphQueryGetNearbyUsersArgs,
    GraphQueryGetUserPositionArgs
} from "../../facades/graphql";
import authentication from "../authentication";
import {Request} from "express";
import PositionFacade from "../../facades/PositionFacade";

export async function updateOwnPosition(args: GraphMutationUpdateOwnPositionArgs, request: Request) {
    const authenticatedUser = await authentication(request);
    return PositionFacade.updateUserPosition(authenticatedUser._id, args.longitude, args.latitude);
}

export async function getNearbyUsers(args: GraphQueryGetNearbyUsersArgs, request: Request) {
    const authenticatedUser = await authentication(request);
    return PositionFacade.getNearbyUsers(authenticatedUser._id, args.radiusMeters);
}

export async function getUserPosition(args: GraphQueryGetUserPositionArgs) {
    return PositionFacade.getUserPosition(args.user);
}